import { frames } from "./frames";
import { Intro } from "@/components/frames/Intro";
import { Play } from "@/components/frames/Play";
import { Outcome } from "@/components/frames/Outcome";
import { End } from "@/components/frames/End";
import { Deposit } from "@/components/frames/Deposit";
import { Winnings } from "@/components/frames/Winnings";
import { Summary } from "@/components/frames/Summary";
import { parseDepositTransactionData } from "@/components/onchain/helpers";
import {
  createDeposit,
  createSession,
  getOrCreateUserWithId,
  getPlayWithId,
  getSessionWithId,
  updatePlayerAccount,
} from "@/components/db/query";
import { error } from "frames.js/core";
import { Info } from "@/components/frames/Info";
import { Ch13Details } from "@/components/frames/Ch13Details";

const allowlist = new Set([
  21224, 886, 13648, 315, 13180, 4923, 338915, 2210, 119, 2904, 258796, 296520,
  355543, 297636, 291673, 339558, 238132, 358, 254210, 241532, 346075, 301772,
  1214, 325, 265885, 16857, 333079, 302846, 8004, 2417, 4461, 771, 59, 3391,
  1338, 3850, 258564, 417554, 390336, 337018, 273708, 18751, 200375, 4995,
  226972, 323021, 263574, 249121, 474326, 381440, 383327, 377610, 1634, 16, 18,
  9274,
]);

const handleRequest = frames(async (ctx) => {
  let player;
  let session;
  try {
    console.log("Response starts", Date.now());
    const action = ctx.searchParams.value;
    const previousAction = ctx.searchParams.previousAction;
    const transactionHash = ctx.message?.transactionId;
    let sessionId = ctx.searchParams.sessionId;
    const playerId = ctx.message?.requesterFid;
    const playId = ctx.searchParams.playId;
    if (ctx.message ? !ctx.message?.isValid : false) {
      return error("Invalid signature", 400);
    }

    if (playerId) player = await getOrCreateUserWithId(playerId);
    if (sessionId) {
      session = await getSessionWithId(sessionId);
    } else if (!sessionId && playerId) {
      session = await createSession(playerId);
      sessionId = session.id;
    }

    console.log("Response Continues:", Date.now());

    if (playId && previousAction) {
      const play = await getPlayWithId(playId);
      if (previousAction === "dump") {
        player = await updatePlayerAccount(playerId, {
          play_token_balances: {
            ["usdc"]:
              Number(player.play_token_balances?.usdc || 0) +
              Number(play.won_amount_usdc),
          },
        });
        // await updatePlayWithId(playId, { hodl: false });
      } else if (previousAction === "hodl") {
        if (play.award_token_balance) {
          const awardToken = Object.keys(play.award_token_balance)[0];
          const payoutTokenAmount = play.award_token_balance[awardToken];
          player = await updatePlayerAccount(playerId, {
            award_token_balances: {
              ...(player.award_token_balances || {}),
              [awardToken]:
                ((player.award_token_balances &&
                  player.award_token_balances[awardToken]) ||
                  0) + payoutTokenAmount,
            },
            award_tokens_usdc_value:
              player.award_tokens_usdc_value + play.won_amount_usdc,
          });
        }
        // await updatePlayWithId(playId, { hodl: true });
      }
    }

    if (action === "Info") {
      return Info({});
    } else if (action === "Ch13Details") {
      return Ch13Details({});
    } else if (transactionHash && action === "Deposit") {
      const { from, to, nominalValueInUSDC } =
        await parseDepositTransactionData(transactionHash);

      await createDeposit(
        playerId,
        nominalValueInUSDC,
        sessionId,
        transactionHash
      );

      player = await updatePlayerAccount(ctx.message.requesterFid, {
        play_token_balances: {
          usdc:
            nominalValueInUSDC +
            (player?.play_token_balances
              ? player.play_token_balances["usdc"] || 0
              : 0),
        },
        wallet_address: from,
      });
      return Play({ ctx, sessionId, player });
    } else if (action === "Deposit") {
      if (!allowlist.has(playerId)) {
        throw new Error("NOT ALLOWED");
      }
      const playAmountBalance =
        Math.round(
          Number(
            player?.play_token_balances ? player.play_token_balances["usdc"] : 0
          ) * 100
        ) / 100;
      return Deposit({
        ctx,
        sessionId,
        message: `Your Balance: ${playAmountBalance} USDC`,
        player,
      });
    } else if (action === "Play") {
      return Play({ ctx, sessionId, player });
    } else if (action === "Outcome") {
      const playAmountBalance =
        Math.round(
          Number(
            player?.play_token_balances ? player.play_token_balances["usdc"] : 0
          ) * 100
        ) / 100;
      if (
        playAmountBalance <= 0 ||
        playAmountBalance < Number(ctx.searchParams.amount)
      ) {
        return Deposit({
          ctx,
          sessionId,
          message: `Your Balance: ${playAmountBalance} USDC`,
          player,
        });
      }
      return Outcome({ ctx, sessionId, player });
    } else if (action === "End") {
      return End({ ctx, sessionId });
    } else if (action === "Winnings") {
      return Winnings({ ctx, sessionId });
    } else if (action === "Summary") {
      return Summary({ ctx, sessionId, transactionHash, player });
    } else {
      return Intro({});
    }
  } catch (err) {
    if (err.message === "NOT ALLOWED") {
      return error(
        "Oops! You are not on the allowlist. Join the waitlist to play.",
        400
      );
    }
    console.error({ err, ctx });
    return error("Ooops! DM @mememania for help", 400);
  }
});

export const GET = handleRequest;
export const POST = handleRequest;

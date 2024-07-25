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
  createSession,
  getOrCreateUserWithId,
  getPlayWithId,
  getSessionWithId,
  updatePlayWithId,
  updatePlayerAccount,
  updateSession,
} from "@/components/db/query";
import { error } from "frames.js/core";

const allowlist = new Set([
  21224, 886, 13648, 315, 13180, 4923, 338915, 2210, 119, 2904, 258796, 296520,
  355543, 297636, 291673, 339558, 238132, 358, 254210, 241532, 346075, 301772,
  1214, 325, 265885, 16857, 333079, 302846, 8004, 2417, 4461, 771, 59, 3391,
]);

const handleRequest = frames(async (ctx) => {
  let player;
  let session;
  try {
    const action = ctx.searchParams.value;
    const previousAction = ctx.searchParams.previousAction;
    const transactionHash = ctx.message?.transactionId;
    let sessionId = ctx.searchParams.sessionId;
    const playerId = ctx.message?.requesterFid;
    const playId = ctx.searchParams.playId;
    // if (ctx.message ? !ctx.message?.isValid : false) {
    //   return error("Invalid signature", 400);
    // }

    if (playerId) player = await getOrCreateUserWithId(playerId);
    if (sessionId) {
      session = await getSessionWithId(sessionId);
    } else if (!sessionId && playerId) {
      session = await createSession(playerId);
      sessionId = session.id;
    }

    if (playId && previousAction) {
      const play = await getPlayWithId(playId);
      if (previousAction === "dump") {
        await updatePlayerAccount(playerId, {
          play_token_balances: {
            ["usdc"]: player.play_token_balances["usdc"] + play.won_amount_usdc,
          },
        });
        await updatePlayWithId(playId, { hodl: false });
      } else if (previousAction === "hodl") {
        if (play.award_token_balance) {
          const awardToken = Object.keys(play.award_token_balance)[0];
          const payoutTokenAmount = play.award_token_balance[awardToken];
          await updatePlayerAccount(playerId, {
            award_token_balances: {
              ...(player.award_token_balances || {}),
              [awardToken]:
                ((player.award_token_balances &&
                  player.award_token_balances[awardToken]) ||
                  0) + payoutTokenAmount,
            },
          });
        }
        await updatePlayWithId(playId, { hodl: true });
      }
    }

    if (transactionHash && action === "Deposit") {
      const { from, to, nominalValueInUSDC } =
        await parseDepositTransactionData(transactionHash);

      await updateSession(sessionId, {
        deposit_usdc: nominalValueInUSDC + (session?.deposit_usdc || 0),
        connected_wallet: from,
      });
      await updatePlayerAccount(ctx.message.requesterFid, {
        play_token_balances: {
          usdc:
            nominalValueInUSDC +
            (player?.play_token_balances
              ? player.play_token_balances["usdc"] || 0
              : 0),
        },
        wallet_address: from,
      });
      return Play({ ctx, sessionId });
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
        message: `Balance: ${playAmountBalance} USDC`,
      });
    } else if (action === "Play") {
      return Play({ ctx, sessionId });
    } else if (action === "Outcome") {
      const playAmountBalance =
        Math.round(
          Number(
            player?.play_token_balances ? player.play_token_balances["usdc"] : 0
          ) * 100
        ) / 100;
      console.log({ playAmountBalance });
      if (
        playAmountBalance <= 0 ||
        playAmountBalance < Number(ctx.searchParams.amount)
      ) {
        return Deposit({
          ctx,
          message: `Balance: ${playAmountBalance} USDC`,
        });
      }
      return Outcome({ ctx, sessionId });
    } else if (action === "End") {
      return End({ ctx, sessionId });
    } else if (action === "Winnings") {
      return Winnings({ ctx, sessionId });
    } else if (action === "Summary") {
      return Summary({ ctx, sessionId, transactionHash });
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

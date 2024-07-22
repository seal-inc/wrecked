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
        if (play.award_token_balances) {
          const awardToken = Object.keys(play.award_token_balances)[0];
          const payoutTokenAmount = play.award_token_balances[awardToken];
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
      const playAmountBalance =
        Math.round(
          Number(
            player?.play_token_balances ? player.play_token_balances["usdc"] : 0
          ) * 100
        ) / 100;
      console.log({ playAmountBalance });
      return Deposit({
        ctx,
        sessionId,
        message: `Balance ${playAmountBalance || 0} USDC.`,
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
      if (
        playAmountBalance <= 0 ||
        playAmountBalance < Number(ctx.searchParams.amount)
      ) {
        return Deposit({
          ctx,
          message: `Balance: ${playAmountBalance} USDC (deposit more)`,
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
  } catch (error) {
    console.error({ error, ctx });
    return error("Ooops! We shit the bed. DM @mememania for help", 500);
  }
});

export const GET = handleRequest;
export const POST = handleRequest;

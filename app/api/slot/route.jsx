import { frames } from "./frames";
import { Intro } from "@/components/frames/Intro";
import { Play } from "@/components/frames/Play";
import { Outcome } from "@/components/frames/Outcome";
import { End } from "@/components/frames/End";
import { Deposit } from "@/components/frames/Deposit";
import { Winnings } from "@/components/frames/Winnings";
import { parseDepositTransactionData } from "@/components/onchain/helpers";
import {
  createSession,
  getOrCreateUserWithId,
  updatePlayerAccount,
} from "@/components/db/query";

const handleRequest = frames(async (ctx) => {
  try {
    const action = ctx.searchParams.value;
    const transactionHash = ctx.message?.transactionId;
    if (transactionHash) {
      const { from, to, nominalValueInUSDC } =
        await parseDepositTransactionData(transactionHash);
      await createSession(ctx.message.requesterFid, from, nominalValueInUSDC);
      await updatePlayerAccount(
        ctx.message.requesterFid,
        "play_token_balances",
        {
          usdc: nominalValueInUSDC,
        }
      );
      return Play({ ctx });
    } else if (action === "Deposit") {
      return Deposit({ ctx });
    } else if (action === "Play") {
      return Play({ ctx });
    } else if (action === "Outcome") {
      return Outcome({ ctx });
    } else if (action === "End") {
      return End({ ctx });
    } else if (action === "Winnings") {
      return Winnings({ ctx });
    } else {
      return Intro({ ctx });
    }
  } catch (error) {
    console.error(error);
    return error("Something went wrong! Try again later");
  }
});

export const GET = handleRequest;
export const POST = handleRequest;

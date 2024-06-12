import { frames } from "./frames";
import { Intro } from "@/components/frames/Intro";
import { Play } from "@/components/frames/Play";
// import { Result } from "@/components/frames/Result";
import { Deposit } from "@/components/frames/Deposit";
import { parseDepositTransactionData } from "@/components/onchain/helpers";
import { createSession } from "@/components/db/query";

const handleRequest = frames(async (ctx) => {
  try {
    const gameId = ctx.searchParams.id;
    const action = ctx.searchParams.value;
    const transactionHash = ctx.message?.transactionId;
    // Get the game with the specific id
    if (transactionHash) {
      const { from, to, nominalValueInUSDC } =
        await parseDepositTransactionData(transactionHash);
      await createSession(ctx.message.requesterFid, from, nominalValueInUSDC);
      return Play({ ctx });
    } else if (action === "Deposit") {
      return Deposit({ gameId, ctx });
    } else if (action === "Play") {
      return Play({ gameId, ctx });
    } else {
      return Intro({ gameId, ctx });
    }
  } catch (error) {
    console.error(error);
    return error("Something went wrong! Try again later");
  }
});

export const GET = handleRequest;
export const POST = handleRequest;

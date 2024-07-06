import { getExitTxData } from "@/components/onchain/helpers";
import { frames } from "../frames";
import { error, transaction } from "frames.js/core";
import { getOrCreateUserWithId } from "@/components/db/query";

const handleRequest = frames(async (ctx) => {
  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  console.log({ player });
  if (!player) {
    return error("Player not found");
  }
  const txdata = await getExitTxData(player);
  console.log({ txdata });
  return transaction(txdata);
});

export const GET = handleRequest;
export const POST = handleRequest;

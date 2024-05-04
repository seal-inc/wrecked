import { encodeFunctionData } from "viem";
import usdcABI from "./contracts/usdcABI.json" assert { type: "json" };
import { NextResponse } from "next/server";
import { getFrameMessage } from "frames.js";
import { getGameWithId } from "@/components/db/query";

export const POST = async (req) => {
  const json = await req.json();
  const url = new URL(req.url);

  const frameMessage = await getFrameMessage(json);
  if (!frameMessage) {
    throw new Error("No frame message");
  }
  const gameId = url.searchParams.get("id");
  const game = await getGameWithId(gameId);
  if (!frameMessage) {
    throw new Error("Not a hosted game");
  }

  if (!process.env.WRECKED_HOT_ADDRESS) {
    throw new Error("WRECKED_HOT_ADDRESS missing");
  }

  // TODO: CHECK IF THE USER HAS ENOUGH USDC TO PLAY

  // Decimals for USDC token: 6
  const decimals = 6;
  const amountToSendInDecimals = game.base_cost_of_play * 10 ** decimals;
  const calldata = encodeFunctionData({
    abi: usdcABI,
    functionName: "transfer",
    args: [process.env.WRECKED_HOT_ADDRESS, amountToSendInDecimals],
  });

  const txData = {
    chainId: game.chain_id,
    method: "eth_sendTransaction",
    params: {
      ABI: usdcABI,
      to: game.currency_erc20_contract_address,
      data: calldata,
    },
  };

  return NextResponse.json(txData);
};

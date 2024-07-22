import { getFrameMessage } from "frames.js";
import { getDepositTxData } from "@/components/onchain/helpers";
import { frames } from "../frames";
import { error, transaction } from "frames.js/core";

const handleRequest = frames(async (ctx) => {
  const { inputText } = ctx.message;
  const pressedButton = ctx.pressedButton;
  let amount;

  if (pressedButton.index === 1) {
    amount = 10;
  } else if (pressedButton.index === 2) {
    if (
      typeof inputText === "string" &&
      !isNaN(inputText) &&
      inputText.length > 0
    ) {
      console.log({ inputText });
      amount = Number(inputText);
    } else {
      return error("Please enter a valid amount (>0) below.", 400);
    }
  }
  const txdata = getDepositTxData(amount);
  return transaction(txdata);
});

export const GET = handleRequest;
export const POST = handleRequest;

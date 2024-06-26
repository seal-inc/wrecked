import { getFrameMessage } from "frames.js";
import { getDepositTxData } from "@/components/onchain/helpers";
import { frames } from "../frames";
import { error, transaction } from "frames.js/core";

export const POST = frames(async (ctx) => {
  const { inputText } = ctx.message;
  const pressedButton = ctx.pressedButton;
  let amount;

  if (pressedButton.index === 1) {
    amount = 10;
  } else if (pressedButton.index === 2) {
    if (typeof inputText === "string" && !isNaN(inputText)) {
      amount = Number(inputText);
    } else {
      return error("Invalid input. Amount must be a number.", 400);
    }
  }
  const txdata = getDepositTxData(amount);
  return transaction(txdata);
});

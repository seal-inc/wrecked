import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { executePlay } from "../game/executePlay";
import {
  getOrCreateUserWithId,
  registerPlay,
  updatePlayerAccount,
} from "../db/query";
import { fetchWithTimeout } from "../game/utils";

export const Outcome = async ({ ctx, sessionId }) => {
  const playAmount = ctx.searchParams.amount;
  const playerId = ctx.message?.requesterFid;

  // TODO: Check if someone has the amount to play
  const player = await getOrCreateUserWithId(playerId);
  // Get the outcome of the play
  const {
    combination,
    totalWinnings,
    payoutToken,
    payoutTokenAmount,
    payoutMultiple,
  } = await executePlay(playAmount);

  // Register the play
  const play = await registerPlay(
    playerId,
    sessionId,
    playAmount,
    combination,
    totalWinnings,
    payoutToken,
    payoutTokenAmount
  );

  // TODO: update the player's account

  await updatePlayerAccount(playerId, {
    play_token_balances: {
      ["usdc"]: player.play_token_balances["usdc"] - playAmount,
    },
  });

  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/outcome?id=${Date.now()}&&playId=${play.id}`;

  await fetchWithTimeout([imageUrl]);

  return {
    image: imageUrl,
    textInput:
      payoutMultiple === 0.1
        ? "Could have gone better! 🥺"
        : payoutMultiple === 2
        ? "You did good"
        : payoutMultiple === 5
        ? "This is rare"
        : payoutMultiple === "10"
        ? "WoW! You just made a fortune!"
        : "You are a legend !",
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Winnings", playId: play.id, sessionId },
        }}
      >
        👀 your payout!
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

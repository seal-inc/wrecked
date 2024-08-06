import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { executePlay } from "../game/executePlay";
import { registerPlay, updatePlayerAccount } from "../db/query";

export const Outcome = async ({ ctx, sessionId, player }) => {
  const playAmount = Number(ctx.searchParams.amount);
  const playerId = ctx.message?.requesterFid;

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
      ["usdc"]: Number(player.play_token_balances["usdc"]) - Number(playAmount),
    },
    ch13_points: player.ch13_points + playAmount * 10,
    award_token_balances: {
      ...(player.award_token_balances || {}),
      ["ch13"]:
        (player.award_token_balances
          ? player.award_token_balances["ch13"] || 0
          : 0) +
        playAmount * 10,
    },
  });

  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/outcome?id=${Date.now()}&&play=${JSON.stringify(play)}`;
  console.log("Response returns:", Date.now());
  return {
    image: imageUrl,
    textInput:
      payoutMultiple === 0.1
        ? "Better luck next time 🥺"
        : payoutMultiple === 2 || payoutMultiple === 3
        ? "WINNER! WINNER! 🎉🎉🎉"
        : payoutMultiple === 5
        ? "Smells like a whale 🐋"
        : payoutMultiple === 10
        ? "To the Moooon 🌕🌚🌙"
        : "To the Mooooon 🌕🌚🌝🌙",
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

import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { updatePlayerAccount } from "../db/query";

export const Summary = async ({ ctx, sessionId, transactionHash, player }) => {
  // Get the game with the specific id
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&player=${JSON.stringify(player)}`;

  console.log("Response returns:", Date.now());

  const updatedPlayTokenBalances = { ...player.play_token_balances };
  const updatedAwardTokenBalances = {};

  // Update play_token_balances
  for (const token in player.play_token_balances) {
    updatedPlayTokenBalances[token] = 0;
  }

  // Update award_token_balances
  for (const token in player.award_token_balances) {
    updatedAwardTokenBalances[token] = 0;
  }
  await updatePlayerAccount(player.id, {
    play_token_balances: updatedPlayTokenBalances,
    award_token_balances: updatedAwardTokenBalances,
    nonce: player.nonce + 1,
  });

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          pathname: "/",
        }}
      >
        Play again
      </Button>,
      <Button
        action="link"
        target={`${process.env.BLOCK_EXPLORER_URL}/tx/${transactionHash}`}
      >
        👀 your earnings
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

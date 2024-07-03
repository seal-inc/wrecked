import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import {
  getOrCreateUserWithId,
  getSessionWithId,
  updatePlayerAccount,
} from "../db/query";

export const Summary = async ({ ctx, sessionId, transactionHash }) => {
  // Get the game with the specific id
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&playId=${playId}`;

  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const session = await getSessionWithId(sessionId);
  const updatedPlayTokenBalances = {};
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
  });

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="link"
        target={`${process.env.BLOCK_EXPLORER_URL}/tx/${transactionHash}`}
      >
        Check the transaction on the explorer
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

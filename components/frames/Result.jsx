import { Button } from "frames.js/next";
import { executePlay } from "../game/executePlay";

export const Result = async ({ ctx }) => {
  // Get the game with the specific id
  const transaction_hash = ctx.message.transactionId;
  const { play, game } = await executePlay(ctx, transaction_hash);
  
  return {
    image: (
      <span tw="m-6">
        {play.amount_won > 0
          ? `You won ${game.current_prize}! Congratulations! Continue playing to win more!`
          : "Sorry, you didn't get it this time. Try again, the pot just got bigger!"}
      </span>
    ),
    buttons: [
      <Button action="post" target={{ query: { value: "Play", id: game.id } }}>
        Try again
      </Button>,
    ],
  };
};

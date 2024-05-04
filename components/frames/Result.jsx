import { Button } from "frames.js/next";
import { executePlay } from "../game/executePlay";

export const Result = async ({ ctx }) => {
  // Get the game with the specific id
  const transaction_hash = ctx.message.transactionId;
  const { play, game } = await executePlay(ctx, transaction_hash);
  return {
    image: (
      <span tw="m-6">
        {game.winner === play.player
          ? `You won the jackpot sum of ${game.current_prize}! Congratulations!`
          : "Sorry, you didn't get it this time. Try again, the pool just got bigger!"}
      </span>
    ),
    buttons: [
      !game.winner && (
        <Button
          action="post"
          target={{ query: { value: "Play", id: game.id } }}
        >
          Try again
        </Button>
      ),
    ],
  };
};

import { Button } from "frames.js/next";
import { executePlay } from "../game/executePlay";
import { getGameWithId } from "../db/query";

export const Result = async ({ ctx }) => {
  // Get the game with the specific id
  const transaction_hash = ctx.message.transactionId;
  const playId = ctx.searchParams.playId;
  const gameId = ctx.searchParams.id;
  const game = await getGameWithId(gameId);
  const { amountWon } = await executePlay(transaction_hash, game, playId);
  const imageUrl = `${
    process.env.APP_URL
  }/api/wrecked/image/result?id=${Date.now()}&gameId=${gameId}&playId=${playId}&amountWon=${amountWon}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="tx"
        target={{
          pathname: "/tx-data",
          query: { id: gameId, playId: playId },
        }}
        post_url={{
          pathname: "/",
          query: { id: gameId, playId: playId },
        }}
      >
        {`Buy ${game.base_cost_of_play} ${game.currency_symbol} ticket`}
      </Button>,
    ],
  };
};

import { Button } from "frames.js/next";
import { executePlay } from "../game/executePlay";
import { fetchWithTimeout, publicClient } from "../game/utils";

export const Result = async ({ ctx }) => {
  // Get the game with the specific id
  const transaction_hash = ctx.message.transactionId;
  const { play, game } = await executePlay(ctx, transaction_hash);
  const imageUrl = `${
    process.env.APP_URL
  }/api/wrecked/image/result?id=${Date.now()}&playId=${play.id}`;
  await fetchWithTimeout([imageUrl]);

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="tx"
        target={{
          pathname: "/tx-data",
          query: { id: game.id, playId: play.id },
        }}
        post_url={{
          pathname: "/",
          query: { id: game.id, playId: play.id },
        }}
      >
        {`Buy ${game.base_cost_of_play} ${game.currency_symbol} ticket`}
      </Button>,
    ],
  };
};

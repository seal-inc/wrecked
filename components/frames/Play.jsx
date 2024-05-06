import {
  createAndGetPlay,
  getGameWithId,
  getOrCreateUserWithId,
} from "../db/query";
import { Button } from "frames.js/next";
import { checkFollower, fetchWithTimeout } from "../game/utils";
import { fonts } from "../game/fonts";

export const Play = async ({ gameId, ctx }) => {
  // console.log("Play", gameId, ctx.message?.requesterFid);
  const game = await getGameWithId(gameId);
  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const play = await createAndGetPlay(player, game);
  const checkFollow = await checkFollower(ctx.message?.requesterFid, "kramer");
  const imageUrl = `${
    process.env.APP_URL
  }/api/wrecked/image/play?id=${Date.now()}&gameId=${gameId}&playerId=${
    ctx.message?.requesterFid
  }`;

  await fetchWithTimeout([imageUrl]);

  return {
    image: imageUrl,
    buttons: game
      ? checkFollow
        ? [
            <Button
              action="tx"
              target={{
                pathname: "/tx-data",
                query: { id: gameId, playId: play.id },
              }}
              post_url={{
                pathname: "/",
                query: { id: gameId, playId: play.id },
              }}
            >
              {`Buy ${game.base_cost_of_play} ${game.currency_symbol} ticket`}
            </Button>,
          ]
        : [
            <Button
              action="link"
              target="https://warpcast.com/~/channel/kramer"
            >
              Follow
            </Button>,
            <Button
              action="post"
              target={{ query: { value: "Play", id: gameId } }}
            >
              Try again
            </Button>,
          ]
      : [],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1.91:1",
    },
  };
};

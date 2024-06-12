import {
  createAndGetPlay,
  getGameWithId,
  getOrCreateUserWithId,
} from "../db/query";
import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../game/utils";
import { fonts } from "../game/fonts";

export const Deposit = async ({ gameId, ctx }) => {
  const game = await getGameWithId(gameId);
  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const play = await createAndGetPlay(player, game);
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/deposit?id=${Date.now()}&amp;gameId=${gameId}&playerId=${
    ctx.message?.requesterFid
  }`;

  await fetchWithTimeout([imageUrl]);

  return {
    image: imageUrl,
    buttons: game
      ? [
          <Button
            action="tx"
            target={{
              pathname: "/txdata",
              query: { id: gameId, playId: play.id },
            }}
            post_url={{
              pathname: "/",
              query: { id: gameId, playId: play.id },
            }}
          >
            {`Deposit 10 $USDC`}
          </Button>,
          <Button
            action="tx"
            target={{
              pathname: "/txdata",
              query: { id: gameId, playId: play.id },
            }}
            post_url={{
              pathname: "/",
              query: { id: gameId, playId: play.id },
            }}
          >
            {`Enter custom amount`}
          </Button>,
        ]
      : [],
    textInput: " Enter custom $USDC to deposit ",
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1.91:1",
    },
  };
};

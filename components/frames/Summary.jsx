import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import {
  getOrCreateUserWithId,
  getSessionWithId,
  updatePlayerAccount,
} from "../db/query";

export const Summary = async ({ ctx, sessionId, transactionHash }) => {
  // Get the game with the specific id
  const playerId = ctx.message?.requesterFid;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&playerId=${playerId}`;

  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);

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

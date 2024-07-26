import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Summary = async ({ ctx, sessionId, transactionHash, player }) => {
  // Get the game with the specific id
  const playerId = ctx.message?.requesterFid;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&player=${JSON.stringify(player)}`;

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

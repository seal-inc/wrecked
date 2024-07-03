import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const End = async ({ ctx, sessionId }) => {
  // Get the game with the specific id
  const playId = ctx.searchParams.playId;
  const imageUrl = `${process.env.APP_URL}/artifacts/end.gif`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Play", sessionId },
        }}
      >
        Yes
      </Button>,
      <Button
        action="tx"
        target={{
          pathname: "/exit",
        }}
        post_url={{
          pathname: "/",
          query: {
            value: "Summary",
            sessionId,
          },
        }}
      >
        No
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

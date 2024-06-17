import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Winnings = async ({ ctx }) => {
  // Get the game with the specific id
  const sessionId = ctx.searchParams.sessionId;
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/winnings?id=${Date.now()}&playId=${playId}&sessionId=${sessionId}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Play", after: "dump" },
        }}
      >
        Dump
      </Button>,
      <Button
        action="post"
        target={{
          query: { value: "Play", after: "hodl" },
        }}
      >
        HODL
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

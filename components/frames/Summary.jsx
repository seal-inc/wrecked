import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Summary = async ({ ctx }) => {
  // Get the game with the specific id
  const sessionId = ctx.searchParams.sessionId;
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/outcome?id=${Date.now()}&playId=${playId}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Winnings" },
        }}
      >
        check your winnigns
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

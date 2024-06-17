import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const End = async ({ ctx }) => {
  // Get the game with the specific id
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/end?id=${Date.now()}&playId=${playId}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Play" },
        }}
      >
        Yes
      </Button>,
      <Button
        action="post"
        target={{
          query: { value: "Summary" },
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

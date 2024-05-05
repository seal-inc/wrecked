import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { fetchWithTimeout } from "../game/utils";

export const Intro = async ({ gameId, ctx }) => {
  // Get the game with the specific id
  const imageUrl = `${
    process.env.APP_URL
  }/api/wrecked/image/intro?id=${Date.now()}&gameId=${gameId}`;

  await fetchWithTimeout([imageUrl]);
  return {
    image: imageUrl,
    buttons: [
      <Button action="post" target={{ query: { value: "Play", id: gameId } }}>
        Play
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1.91:1",
    },
  };
};

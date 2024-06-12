import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../game/utils";

export const Intro = async ({ gameId, ctx }) => {
  // Get the game with the specific id
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/intro?id=${Date.now()}`;

  await fetchWithTimeout([imageUrl]);
  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{ query: { value: "Deposit", id: gameId } }}
      >
        Click here to start
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1.91:1",
    },
  };
};

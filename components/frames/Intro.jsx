import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../game/utils";
import { fonts } from "../game/fonts";

export const Intro = async ({ ctx }) => {
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/intro?id=${Date.now()}`;

  await fetchWithTimeout([imageUrl]);
  return {
    image: imageUrl,
    buttons: [
      <Button action="post" target={{ query: { value: "Deposit" } }}>
        Click here to start
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

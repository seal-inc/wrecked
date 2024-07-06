import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Intro = async ({}) => {
  const imageUrl = `${process.env.APP_URL}/artifacts/init.gif`;

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

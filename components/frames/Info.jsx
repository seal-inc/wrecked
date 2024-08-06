import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Info = async ({}) => {
  const imageUrl = `${process.env.APP_URL}/artifacts/info.png`;

  return {
    image: imageUrl,
    buttons: [
      <Button action="post" target={{ query: { value: "Ch13Details" } }}>
        Tell me about $CH13
      </Button>,
      <Button action="post" target={{ query: { value: "Play" } }}>
        Skip to play
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

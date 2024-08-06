import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Ch13Details = async ({}) => {
  const imageUrl = `${process.env.APP_URL}/artifacts/ch13_explainer.png`;

  return {
    image: imageUrl,
    buttons: [
      <Button action="post" target={{ query: { value: "Deposit" } }}>
        Deposit USDC
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

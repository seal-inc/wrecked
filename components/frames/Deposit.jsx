import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Deposit = async ({ ctx, message, sessionId }) => {
  const imageUrl = `${process.env.APP_URL}/artifacts/deposit.gif`;

  console.log("Response returns", Date.now());
  return {
    image: imageUrl,
    buttons: [
      <Button
        action="tx"
        target={{
          pathname: "/txdata",
        }}
        post_url={{
          pathname: "/",
          query: {
            value: "Deposit",
            sessionId,
          },
        }}
      >
        {`10 USDC`}
      </Button>,
      <Button
        action="tx"
        target={{
          pathname: "/txdata",
        }}
        post_url={{
          pathname: "/",
          query: {
            value: "Deposit",
            sessionId,
          },
        }}
      >
        {`Custom USDC`}
      </Button>,
      <Button
        action="post"
        target={{
          query: { value: "Play", sessionId },
        }}
      >
        {`Skip ⏩`}
      </Button>,
    ],
    textInput: "Enter custom $USDC to deposit",
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

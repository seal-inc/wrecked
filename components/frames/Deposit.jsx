import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../game/utils";
import { fonts } from "../game/fonts";

export const Deposit = async ({ ctx }) => {
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/deposit?id=${Date.now()}&playerId=${
    ctx.message?.requesterFid
  }`;

  await fetchWithTimeout([imageUrl]);

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
        }}
      >
        {`Deposit 10 $USDC`}
      </Button>,
      <Button
        action="tx"
        target={{
          pathname: "/txdata",
        }}
        post_url={{
          pathname: "/",
        }}
      >
        {`Enter custom amount`}
      </Button>,
    ],
    textInput: " Enter custom $USDC to deposit ",
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

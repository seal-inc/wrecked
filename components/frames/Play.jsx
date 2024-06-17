import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../game/utils";
import { fonts } from "../game/fonts";

export const Play = async ({ ctx, sessionId, playerId }) => {
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/play?id=${Date.now()}&&playerId=${
    ctx.message?.requesterFid
  }`;

  await fetchWithTimeout([imageUrl]);

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "1" } }}
      >
        1 USDC
      </Button>,
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "5" } }}
      >
        5 USDC
      </Button>,
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "10" } }}
      >
        10 USDC
      </Button>,
      <Button action="post" target={{ query: { value: "End" } }}>
        END
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

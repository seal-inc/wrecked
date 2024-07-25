import { Button } from "frames.js/next";
import { fonts } from "@/components/game/fonts";

export const Play = async ({ ctx, sessionId, player }) => {
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/play?id=${Date.now()}&&player=${JSON.stringify(player)}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "1", sessionId } }}
      >
        1 USDC
      </Button>,
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "5", sessionId } }}
      >
        5 USDC
      </Button>,
      <Button
        action="post"
        target={{ query: { value: "Outcome", amount: "10", sessionId } }}
      >
        10 USDC
      </Button>,
      <Button action="post" target={{ query: { value: "End", sessionId } }}>
        END
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

import { Button } from "frames.js/next";
import { fonts } from "@/components/game/fonts";

export const Play = async ({ ctx, sessionId, player }) => {
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/play?id=${Date.now()}&&player=${JSON.stringify(player)}`;

  console.log("Response returns:", Date.now());
  return {
    image: imageUrl,
    buttons: [
      ...((player.play_token_balances["usdc"] || 0) >= 1
        ? [
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
          ]
        : [
            <Button
              action="post"
              target={{ query: { value: "Deposit", sessionId } }}
            >
              Deposit USDC (Base) to play
            </Button>,
          ]),
      (player.play_token_balances["usdc"] ||
        0 > 0 ||
        Object.keys(player?.award_token_balances || {}).length > 0) && (
        <Button
          action="tx"
          target={{
            pathname: "/exit",
          }}
          post_url={{
            pathname: "/",
            query: {
              value: "Summary",
              sessionId,
            },
          }}
        >
          Cash out
        </Button>
      ),
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { executePlay } from "../game/executePlay";

export const Outcome = async ({ ctx }) => {
  const sessionId = ctx.searchParams.sessionId;
  const playAmount = ctx.searchParams.amount;

  // TODO: Check if someone has the amount to play

  // Get the outcome of the play
  const { combination, totalWinnings } = await executePlay(playAmount);

  console.log({ combination, totalWinnings });

  // Register the play

  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/outcome?id=${Date.now()}`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Winnings" },
        }}
      >
        check your wallet for your winnings
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

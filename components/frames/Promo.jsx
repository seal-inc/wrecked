import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Promo = async ({ ctx, sessionId }) => {
  const playAmount = Number(ctx.searchParams.amount);
  const imageUrl = `${process.env.APP_URL}/artifacts/${
    "promo-spin-" + playAmount
  }.png`;

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: {
            value: "Outcome",
            amount: playAmount,
            sessionId,
            promoSpin: true,
          },
        }}
      >
        Continue
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

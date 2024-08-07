import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { getPlayWithId } from "../db/query";

export const Winnings = async ({ ctx }) => {
  // Get the game with the specific id
  const sessionId = ctx.searchParams.sessionId;
  const playId = ctx.searchParams.playId;
  const play = await getPlayWithId(playId);
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/winnings?id=${Date.now()}&play=${JSON.stringify(play)}`;
  const payoutMultiple =
    Number(play.won_amount_usdc) / Number(play.play_amount);

  console.log("Response returns:", Date.now());

  return {
    image: imageUrl,
    textInput: `${Object.keys(
      play.award_token_balance
    )[0].toUpperCase()} 🐋 or USDC ${payoutMultiple > 0.1 ? "🐋" : "🐟"} ?`,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Play", previousAction: "dump", sessionId, playId },
        }}
      >
        {`Dump for ${play.won_amount_usdc} USDC`}
      </Button>,
      <Button
        action="post"
        target={{
          query: { value: "Play", previousAction: "hodl", sessionId, playId },
        }}
      >
        HODL
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

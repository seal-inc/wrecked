import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { executePlay } from "../game/executePlay";
import { registerPlay, updatePlayerAccount } from "../db/query";

export const Outcome = async ({ ctx, sessionId, player }) => {
  const playAmount = player.first_time
    ? 5 + Number(ctx.searchParams.amount)
    : Number(ctx.searchParams.amount);

  const playerId = ctx.message?.requesterFid;

  // Get the outcome of the play
  const {
    combination,
    totalWinnings,
    payoutToken,
    payoutTokenAmount,
    payoutMultiple,
  } = await executePlay(playAmount);

  // Register the play
  const play = await registerPlay(
    playerId,
    sessionId,
    playAmount,
    combination,
    totalWinnings,
    payoutToken,
    payoutTokenAmount
  );

  await updatePlayerAccount(playerId, {
    play_token_balances: {
      ["usdc"]:
        Number(player.play_token_balances["usdc"]) -
        Number(ctx.searchParams.amount),
    },
    ch13_points: player.ch13_points + playAmount * 10,
    first_time: false,
    award_token_balances: {
      ...(player.award_token_balances || {}),
      ["ch13"]:
        (player.award_token_balances
          ? player.award_token_balances["ch13"] || 0
          : 0) +
        playAmount * 10,
    },
  });

  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/outcome?id=${Date.now()}&&play=${JSON.stringify(play)}`;
  console.log("Response returns:", Date.now());
  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: {
            value: "Play",
            previousAction: "dump",
            sessionId,
            playId: play.id,
          },
        }}
      >
        {`Dump for ${Number(play.won_amount_usdc).toLocaleString()} USDC`}
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            value: "Play",
            previousAction: "hodl",
            sessionId,
            playId: play.id,
          },
        }}
      >
        {`HODL ${payoutToken.toUpperCase()}`}
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

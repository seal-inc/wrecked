import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import {
  getOrCreateUserWithId,
  getSessionWithId,
  updatePlayerAccount,
} from "../db/query";
import { sendToken } from "../onchain/helpers";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("Hello");
sleep(2000).then(() => {
  console.log("World!");
});

export const Summary = async ({ ctx, sessionId }) => {
  // Get the game with the specific id
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&playId=${playId}`;

  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const session = await getSessionWithId(sessionId);

  console.log({ player, session });

  const awardTokenBalances = player?.award_token_balances;
  if (awardTokenBalances) {
    const tokens = Object.keys(awardTokenBalances);
    for (const token of tokens) {
      if (awardTokenBalances[token])
        await sendToken(
          token,
          awardTokenBalances[token],
          player.wallet_address
        );
      await sleep(2000);
    }
  }

  // const playTokenBalances = player?.play_token_balances;
  // if (playTokenBalances) {
  //   const tokens = Object.keys(playTokenBalances);
  //   for (const token of tokens) {
  //     if (playTokenBalances[token])
  //       await sendToken(token, playTokenBalances[token], player.wallet_address);
  //   }
  // }

  const updatedPlayTokenBalances = {};
  const updatedAwardTokenBalances = {};

  // Update play_token_balances
  for (const token in player.play_token_balances) {
    updatedPlayTokenBalances[token] = 0;
  }

  // Update award_token_balances
  for (const token in player.award_token_balances) {
    updatedAwardTokenBalances[token] = 0;
  }

  const playerhere = await updatePlayerAccount(player.id, {
    play_token_balances: updatedPlayTokenBalances,
    award_token_balances: updatedAwardTokenBalances,
  });

  console.log({ playerhere });

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { value: "Winnings", sessionId },
        }}
      >
        check your winnings in your wallet
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

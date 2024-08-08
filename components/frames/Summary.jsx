import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import { getDepositsInSession, updatePlayerAccount } from "../db/query";

export const Summary = async ({ ctx, sessionId, transactionHash, player }) => {
  // Get the game with the specific id
  const totalDeposits = await getDepositsInSession(sessionId);

  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&player=${JSON.stringify(
    player
  )}&totalDeposits=${totalDeposits}`;

  console.log("Response returns:", Date.now());

  // Update play_token_balances

  await updatePlayerAccount(player.id, {
    play_token_balances: { usdc: 0 },
    award_token_balances: {},
    award_tokens_usdc_value: 0,
    nonce: player.nonce + 1,
  });

  return {
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          pathname: "/",
        }}
      >
        Play again
      </Button>,
      <Button
        action="link"
        target={`${process.env.BLOCK_EXPLORER_URL}/tx/${transactionHash}`}
      >
        👀 your earnings
      </Button>,
      // <Button
      //   action="link"
      //   target={`https://warpcast.com/~/compose?text=${"LFG Meme Mania! I just played! You have to try this too!"}&embeds[]=${imageUrl}&embeds[]=${"https://launch.mememania.app/mememania"}}`}
      // >
      //   Share
      // </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};

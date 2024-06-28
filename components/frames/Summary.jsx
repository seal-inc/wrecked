import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";
import {
  getOrCreateUserWithId,
  getSessionWithId,
  updatePlayerAccount,
} from "../db/query";
import { getTokenDetails } from "../onchain/helpers";
import { client } from "../onchain/clients/slotHotWalletClient";
import { encodePacked, keccak256 } from "viem";
import { randomBytes } from "ethers";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Summary = async ({ ctx, sessionId }) => {
  // Get the game with the specific id
  const playId = ctx.searchParams.playId;
  const imageUrl = `${
    process.env.APP_URL
  }/api/slot/image/summary?id=${Date.now()}&playId=${playId}`;

  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const session = await getSessionWithId(sessionId);
  const MEMEMANIA_CONTRACT = process.env.MEMEMANIA_CONTRACT;
  const generateClaimRewards = async (player) => {
    const awardTokenBalances = player?.award_token_balances;
    const playTokenBalances = player?.play_token_balances;
    const tokenBalances = { ...awardTokenBalances, ...playTokenBalances };
    if (!tokenBalances) return;

    const tokens = Object.keys(awardTokenBalances).concat(
      Object.keys(playTokenBalances)
    );
    console.log({ tokens });
    const claimRewards = [];

    for (const token of tokens) {
      const tokenMetadata = getTokenDetails(token);
      if (tokenBalances[token]) {
        const reward = {
          amount: Math.floor(
            tokenBalances[token] * 10 ** tokenMetadata.metadata.decimals
          ),
          tokenType: tokenMetadata.tokenType, // Assuming getTokenDetails provides tokenType
          nonce: "0x" + Buffer.from(randomBytes(32)).toString("hex"),
        };

        const messageHash = keccak256(
          encodePacked(
            ["address", "uint256", "uint8", "bytes32"],
            [
              player.wallet_address,
              reward.amount,
              reward.tokenType,
              reward.nonce,
            ]
          )
        );

        const signature = await client.signMessage({ message: messageHash });
        claimRewards.push({
          ...reward,
          signature,
        });
      }
    }
    return claimRewards;
  };

  const rewardClaims = await generateClaimRewards(player);

  console.log(rewardClaims);
  // const updatedPlayTokenBalances = {};
  // const updatedAwardTokenBalances = {};

  // // Update play_token_balances
  // for (const token in player.play_token_balances) {
  //   updatedPlayTokenBalances[token] = 0;
  // }

  // // Update award_token_balances
  // for (const token in player.award_token_balances) {
  //   updatedAwardTokenBalances[token] = 0;
  // }
  // await updatePlayerAccount(player.id, {
  //   play_token_balances: updatedPlayTokenBalances,
  //   award_token_balances: updatedAwardTokenBalances,
  // });

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

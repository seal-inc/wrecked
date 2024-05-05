import axios from "axios";
import { createWalletClient, encodeFunctionData, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import usdcABI from "../../app/contracts/usdcABI.json" assert { type: "json" };
import { base } from "viem/chains";

export const payWinnerAmount = async (address, amount, game) => {
  const client = createWalletClient({
    chain: base,
    transport: http(),
  });

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

  const decimals = 6;
  const amountToSendInDecimals = amount * 10 ** decimals;

  const calldata = encodeFunctionData({
    abi: usdcABI,
    functionName: "transfer",
    args: [address, amountToSendInDecimals],
  });

  const hash = await client.sendTransaction({
    account,
    to: game.currency_erc20_contract_address,
    data: calldata,
  });
  console.log({ hash });
};

export async function checkFollower(fid, channelId) {
  const response = await axios.get(
    `https://api.warpcast.com/v1/user-channel?fid=${fid}&channelId=${channelId}`
  );
  const { following } = response.data.result;

  return following;
}

export async function checkUSDCBalance(address) {
  const response = await axios.get(
    `https://api.basechain.com/v1/balance?address=${address}`
  );
  const { USDC } = response.data.result;
  return USDC;
}

export async function fetchWithTimeout(urls, timeout = 3000) {
  const fetchPromises = urls.map((url) =>
    Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout while fetching image")),
          timeout
        )
      ),
    ])
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }
        return url;
      })
      .catch((error) => {
        console.error(error);
        return null;
      })
  );

  const responses = await Promise.all(fetchPromises);
  return responses.filter((url) => url !== null);
}

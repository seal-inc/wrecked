import { encodeFunctionData, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import degenABI from "./contracts/degen/abi.json" assert { type: "json" };
import higherABI from "./contracts/higher/abi.json" assert { type: "json" };
import tybgABI from "./contracts/tybg/abi.json" assert { type: "json" };
import usdcABI from "./contracts/usdc/abi.json" assert { type: "json" };
import mememaniaABI from "./contracts/mememania/abi.json" assert { type: "json" };
import { base } from "viem/chains";
import assert from "assert";
import { metadata as usdcMetadata } from "../onchain/contracts/usdc/metadata";
import { metadata as degenMetadata } from "./contracts/degen/metadata";
import { metadata as higherMetadata } from "./contracts/higher/metadata";
import { metadata as tybgMetadata } from "./contracts/tybg/metadata";
import { metadata as mememaniaMetadata } from "./contracts/mememania/metadata";
import { publicClient } from "./clients/publicClient";
import { client } from "./clients/slotHotWalletClient";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";

const errorDecoder = ErrorDecoder.create([mememaniaABI]);

export const getTokenDetails = (token) => {
  switch (token) {
    case "usdc":
      return {
        metadata: usdcMetadata,
        abi: usdcABI,
        tokenType: 3,
      };
    case "degen":
      return {
        metadata: degenMetadata,
        abi: degenABI,
        tokenType: 0,
      };
    case "higher":
      return {
        metadata: higherMetadata,
        abi: higherABI,
        tokenType: 1,
      };
    case "tybg":
      return {
        metadata: tybgMetadata,
        abi: tybgABI,
        tokenType: 2,
      };

    case "mememania":
      return {
        metadata: mememaniaMetadata,
        abi: mememaniaABI,
      };
    default:
      throw new Error("Invalid token");
  }
};

export const getDepositTxData = (amount) => {
  const decimals = usdcMetadata.decimals;
  const amountToSendInDecimals = amount * 10 ** decimals;
  const calldata = encodeFunctionData({
    abi: usdcABI,
    functionName: "transfer",
    args: [process.env.SLOT_HOT_ADDRESS, amountToSendInDecimals],
  });
  return {
    chainId: "eip155:" + base.id,
    method: "eth_sendTransaction",
    params: {
      abi: usdcABI,
      to: usdcMetadata.contractAddress,
      data: calldata,
    },
  };
};

const generateClaimRewards = async (player) => {
  const awardTokenBalances = player?.award_token_balances;
  const playTokenBalances = player?.play_token_balances;
  const tokenBalances = { ...awardTokenBalances, ...playTokenBalances };
  delete tokenBalances["ch13"];

  const tokens = Object.keys(tokenBalances);
  const claimRewards = [];

  const provider = new ethers.AlchemyProvider(
    "base",
    process.env.ALCHEMY_API_KEY
  );
  const signer = new ethers.Wallet(
    process.env.SLOT_HOT_ADDRESS_PRIVATE_KEY,
    provider
  );

  const contract = new ethers.Contract(
    mememaniaMetadata.contractAddress,
    mememaniaABI,
    signer
  );

  for (const token of tokens) {
    const tokenMetadata = getTokenDetails(token);
    if (tokenBalances[token]) {
      const reward = {
        amount: ethers.parseUnits(
          String(tokenBalances[token]),
          tokenMetadata.metadata.decimals
        ),
        tokenType: tokenMetadata.tokenType, // Assuming getTokenDetails provides tokenType
        nonce: ethers.hexlify(ethers.randomBytes(32)),
      };

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint8", "bytes32"],
        [
          player.wallet_address.toLowerCase(),
          reward.amount,
          reward.tokenType,
          reward.nonce,
        ]
      );
      const messageHashBytes = ethers.getBytes(messageHash);

      const signature = await signer.signMessage(messageHashBytes);
      claimRewards.push({
        ...reward,
        signature,
      });
    }
  }

  return claimRewards;
};

export const getExitTxData = async (player) => {
  const claimRewards = await generateClaimRewards(player);
  const exitData = {
    chainId: "eip155:" + base.id,
    method: "eth_sendTransaction",
    params: {
      abi: mememaniaABI,
      to: mememaniaMetadata.contractAddress,
      data: encodeFunctionData({
        abi: mememaniaABI,
        functionName: "claimRewards",
        args: [claimRewards],
      }),
    },
  };
  return exitData;
};

export const parseDepositTransactionData = async (transactionHash) => {
  const transaction = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  const logs = parseEventLogs({
    abi: usdcABI,
    logs: transaction.logs,
    eventName: "Transfer",
  });

  const { from, to, value } = logs[0].args;
  const nominalValueInUSDC =
    Number(value) / Number(10 ** usdcMetadata.decimals);
  assert(to === process.env.SLOT_HOT_ADDRESS);
  // TODO: Make sure this transaction is not redundant
  return {
    from,
    to,
    nominalValueInUSDC,
  };
};

export const sendToken = async (token, amount, address) => {
  const account = privateKeyToAccount(process.env.SLOT_HOT_ADDRESS_PRIVATE_KEY);
  const tokenDetails = getTokenDetails(token);

  const decimals = tokenDetails.metadata.decimals;
  const amountToSendInDecimals = Math.floor(amount * 10 ** decimals);

  const calldata = encodeFunctionData({
    abi: tokenDetails.abi,
    functionName: "transfer",
    args: [address, amountToSendInDecimals],
  });

  const hash = await client.sendTransaction({
    account,
    to: tokenDetails.metadata.contractAddress,
    data: calldata,
  });
  return hash;
};

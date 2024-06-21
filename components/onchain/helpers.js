import { encodeFunctionData, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import degenABI from "./contracts/degen/abi.json" assert { type: "json" };
import higherABI from "./contracts/higher/abi.json" assert { type: "json" };
import tybgABI from "./contracts/tybg/abi.json" assert { type: "json" };
import usdcABI from "./contracts/usdc/abi.json" assert { type: "json" };
import { base } from "viem/chains";
import assert from "assert";
import { metadata as usdcMetadata } from "../onchain/contracts/usdc/metadata";
import { metadata as degenMetadata } from "./contracts/degen/metadata";
import { metadata as higherMetadata } from "./contracts/higher/metadata";
import { metadata as tybgMetadata } from "./contracts/tybg/metadata";
import { publicClient } from "./clients/publicClient";
import { client } from "./clients/slotHotWalletClient";

const getTokenDetails = (token) => {
  switch (token) {
    case "usdc":
      return {
        metadata: usdcMetadata,
        abi: usdcABI,
      };
    case "degen":
      return {
        metadata: degenMetadata,
        abi: degenABI,
      };
    case "higher":
      return {
        metadata: higherMetadata,
        abi: higherABI,
      };
    case "tybg":
      return {
        metadata: tybgMetadata,
        abi: tybgABI,
      };
    default:
      throw new Error("Invalid token");
  }
};

export const getDepositTxData = (amount) => {
  const decimals = usdcMetadata.decimals;
  const amountToSendInDecimals = amount * 10 ** decimals;
  console.log({ usdcABI });
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
  const nominalValueInUSDC = Number(
    BigInt(value) / BigInt(10 ** usdcMetadata.decimals)
  );
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

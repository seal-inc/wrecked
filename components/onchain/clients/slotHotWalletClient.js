import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.SLOT_HOT_ADDRESS_PRIVATE_KEY);

console.log(account);

export const client = createWalletClient({
  account,
  chain: base,
  transport: http(),
}).extend(publicActions);

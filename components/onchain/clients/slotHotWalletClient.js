import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.SLOT_HOT_ADDRESS_PRIVATE_KEY);

export const client = createWalletClient({
  account,
  chain: base,
  transport: http(),
}).extend(publicActions);

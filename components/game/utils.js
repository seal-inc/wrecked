import axios from "axios";

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

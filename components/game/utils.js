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

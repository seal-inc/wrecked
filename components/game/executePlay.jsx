function getRandomNumber(reel) {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  for (const [number, probability] of Object.entries(reel)) {
    cumulativeProbability += probability;
    if (randomValue < cumulativeProbability) {
      return parseInt(number);
    }
  }
}

// Probability distribution for each reel
const reel1 = { 1: 0.25, 2: 0.25, 3: 0.25, 4: 0.25 };
const reel2 = { 1: 0.2, 2: 0.4, 3: 0.2, 4: 0.2 };
const reel3 = { 1: 0.33, 3: 0.33, 4: 0.34 };

// Payout structure
const payoutTable = {
  "1-1-1": 3,
  "3-3-3": 5,
  "4-4-4": 10,
  "1-1": 2,
  "3-3": 2,
  "4-4": 2,
};

// Symbol mapping
const symbolMapping = { 1: "tybg", 2: "chapter13", 3: "higher", 4: "degen" };

const tokenIdsMapping = {
  tybg: "base-god",
  higher: "higher",
  degen: "degen-base",
};

export async function executePlay(playAmount) {
  const [reel1Result, reel2Result, reel3Result] = [
    getRandomNumber(reel1),
    getRandomNumber(reel2),
    getRandomNumber(reel3),
  ];

  const combination = {
    "Reel 1": symbolMapping[reel1Result],
    "Reel 2": symbolMapping[reel2Result],
    "Reel 3": symbolMapping[reel3Result],
  };

  const combinationString = `${reel1Result}-${reel2Result}-${reel3Result}`;
  let payoutMultiple = payoutTable[combinationString] || 0.1;

  if (payoutMultiple === 0.1) {
    if (reel1Result === reel2Result) {
      payoutMultiple =
        payoutTable[`${reel1Result}-${reel2Result}`] || payoutMultiple;
    }
    if (reel2Result === reel3Result) {
      payoutMultiple =
        payoutTable[`${reel2Result}-${reel3Result}`] || payoutMultiple;
    }
  }

  const totalWinnings = payoutMultiple * playAmount;

  // TODO: Select token to payout in

  const tokens = Object.keys(tokenIdsMapping);
  const randomIndex = Math.floor(Math.random() * tokens.length);
  const payoutToken = tokens[randomIndex];
  const tokenId = tokenIdsMapping[payoutToken];

  // Fetch token price from Coingecko API
  const tokenPrice = await fetchTokenPrice(tokenId);

  // Use the token price for further processing

  return {
    combination,
    totalWinnings,
    payoutToken,
    payoutTokenAmount: Math.floor(totalWinnings / tokenPrice),
  };
}
async function fetchTokenPrice(tokenId) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${tokenId}?market_data=true`,
    {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      },
    }
  );
  const data = await response.json();
  const tokenPrice = data.market_data.current_price.usd;
  return tokenPrice;
}

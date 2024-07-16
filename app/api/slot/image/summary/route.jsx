import {
  getOrCreateUserWithId,
  updatePlayerAccount,
} from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const playerId = urlParams.get("playerId");
  const player = await getOrCreateUserWithId(playerId);
  const updatedPlayTokenBalances = { ...player.play_token_balances };
  const updatedAwardTokenBalances = {};

  // Update play_token_balances
  // for (const token in player.play_token_balances) {
  //   updatedPlayTokenBalances[token] = 0;
  // }

  // Update award_token_balances
  for (const token in player.award_token_balances) {
    updatedAwardTokenBalances[token] = 0;
  }
  await updatePlayerAccount(player.id, {
    play_token_balances: updatedPlayTokenBalances,
    award_token_balances: updatedAwardTokenBalances,
  });

  return new ImageResponse(
    (
      <div
        tw="flex flex-row items-start justify-end w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/summary.jpeg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-end mt-[200px] mr-[350px]">
          <span tw="text-5xl text-[#045BB0] mt-[60px] pt-4">
            {player.award_token_balances
              ? player.award_token_balances["degen"] || 0
              : 0}
          </span>
          <span tw="text-5xl text-[#045BB0] mt-[45px]">
            {player.award_token_balances
              ? player.award_token_balances["higher"] || 0
              : 0}
          </span>
          <span tw="text-5xl text-[#045BB0]  mt-[45px]">
            {player.award_token_balances
              ? player.award_token_balances["tybg"] || 0
              : 0}
          </span>
          <span tw="text-5xl text-[#045BB0]  mt-[45px]">
            {player.award_token_balances
              ? player.award_token_balances["chapter13"] || 0
              : 0}
          </span>
        </div>
      </div>
    ),
    {
      headers: {
        key: "Cache-Control",
        value: "public, max-age=1, must-revalidate",
      },

      fonts: fonts,
      height: 1200,
      width: 1200,
    }
  );
};

export const GET = handleRequest;
export const POST = handleRequest;

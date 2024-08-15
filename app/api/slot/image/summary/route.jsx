import { updatePlayerAccount } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const player = JSON.parse(urlParams.get("player"));
  const totalDeposits = Number(urlParams.get("totalDeposits"));

  const profit =
    Number(player.award_tokens_usdc_value || 0) +
    Number(player.play_token_balances["usdc"] || 0) -
    totalDeposits;

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/summary.png)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex justify-end mt-[350px] mr-[390px]">
          <div tw="flex">
            <span tw="flex text-[#045BB0] text-4xl">
              {Number(totalDeposits).toFixed(1)}
            </span>
          </div>
        </div>
        <div tw="flex w-full mt-[135px]">
          <div tw="flex w-1/2 justify-end">
            <span tw=" text-[#045BB0] text-4xl pr-[55px]">
              {Number(player.award_token_balances["degen"] || 0).toFixed(1)}
            </span>
          </div>
          <div tw="flex w-1/2 justify-end">
            <span tw="flex text-[#045BB0] text-4xl pr-[120px]">
              {Number(player.award_token_balances["higher"] || 0).toFixed(1)}
            </span>
          </div>
        </div>
        <div tw="flex w-full mt-[35px]">
          <div tw="flex w-1/2 justify-end">
            <span tw=" text-[#045BB0] text-4xl pr-[55px]">
              {Number(player.award_token_balances["tybg"] || 0).toFixed(1)}
            </span>
          </div>
          <div tw="flex w-1/2 justify-end">
            <span tw="flex text-[#045BB0] text-4xl pr-[120px]">
              {Number(player.play_token_balances["usdc"] || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div tw="flex justify-end mt-[160px] mr-[390px]">
          <div tw="flex">
            <span
              tw={`flex text-4xl ${
                profit > 0 ? "text-[#045BB0]" : "text-red-500"
              }`}
            >
              {Number(profit).toFixed(1)}
            </span>
          </div>
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

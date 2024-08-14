import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const player = JSON.parse(urlParams.get("player"));

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/deposit.png)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col mt-[1000px] items-end w-full h-full">
          <span tw="flex text-[#0CFFC2] mr-[220px] text-[32px]">
            {Number(player.play_token_balances["usdc"] || 0).toLocaleString()}{" "}
            USDC
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

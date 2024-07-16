import { getPlayWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const playId = urlParams.get("playId");
  const play = await getPlayWithId(playId);
  console.log(play);
  const award_token = String(
    Object.keys(play.award_token_balance)[0]
  ).toLowerCase();

  const amountWon = play.award_token_balance[award_token];

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/winning/${award_token}.jpg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-center pt-[400px]">
          <span
            tw={`flex text-6xl text-[#045BB0] ${
              award_token === "tybg"
                ? "pt-24"
                : award_token === "degen"
                ? "pt-12"
                : "pt-16"
            } `}
          >
            {amountWon.toLocaleString()}
          </span>
          <span tw="flex text-5xl text-[#045BB0]  mt-[-36px]">
            {award_token.toUpperCase()}
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

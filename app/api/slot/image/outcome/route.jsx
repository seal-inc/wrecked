import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const play = JSON.parse(urlParams.get("play"));
  const award_token = String(
    Object.keys(play.award_token_balance)[0]
  ).toLowerCase();

  const payoutMultiple = play.won_amount_usdc / play.play_amount_usdc;
  const success = payoutMultiple > 1 ? "win" : "loss";

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/outcome/${success}-${award_token}.png)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-col items-center mt-[65px]">
          <span tw={`flex text-4xl text-[#0EFFBA]`}>
            {payoutMultiple === 2 || payoutMultiple === 3
              ? "WINNER! WINNER!"
              : payoutMultiple === 5
              ? "WHALE LOOK AT U"
              : payoutMultiple === 10
              ? "🌙 2 The Moooon 🌙"
              : "TRY AGAIN!"}
          </span>
        </div>
        <div tw="flex w-full mt-[170px]">
          <img
            tw={success === "win" ? "ml-[388px]" : "ml-[370px]"}
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 1"]}.jpg`}
            height={"200px"}
            width={"140px"}
          ></img>
          <img
            tw="ml-[13px]"
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 2"]}.jpg`}
            height={"200px"}
            width={"140px"}
          ></img>
          <img
            tw="ml-[13px]"
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 3"]}.jpg`}
            height={"200px"}
            width={"140px"}
          ></img>
        </div>
        <div tw="flex flex-col mt-[270px] items-center">
          <div tw="flex text-[#045BB0] text-7xl">
            {String(play.award_token_balance[award_token])
              .toLocaleString()
              .toUpperCase()}
          </div>
          <div tw="flex text-[#045BB0] text-3xl mt-[-32px]">
            {award_token.toUpperCase()}
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

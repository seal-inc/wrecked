import { getOrCreateUserWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const TokenBalance = ({ token, currency }) => {
  const balance = (currency || "") + Number(token || 0).toLocaleString();
  return (
    <div
      tw={`flex text-[#045BB0] justify-center ${
        balance.length > 8
          ? "text-xl"
          : balance.length > 6
          ? "text-3xl"
          : "text-4xl"
      }`}
    >
      {balance}
    </div>
  );
};

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const player = JSON.parse(urlParams.get("player"));

  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-end w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/play.jpg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex flex-row justify-around mb-4 w-full">
          <div
            tw="flex items-center justify-end w-[400px] h-[150px] bg-black bg-opacity-50 rounded-lg"
            style={{
              backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/GAS TANK_button.svg)`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div tw="flex mr-8">
              <TokenBalance
                token={player.play_token_balances?.usdc}
                currency={"$"}
              />
            </div>
          </div>
          <div tw="flex">
            <div tw="flex flex-col">
              <div tw="flex">
                <div
                  tw="flex items-center justify-end w-[400px] h-[150px] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/DEGEN_button.svg)`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div tw="flex mr-8">
                    <TokenBalance
                      token={player?.award_token_balances?.degen}
                      currency={""}
                    />
                  </div>
                </div>
              </div>
              <div tw="flex">
                <div
                  tw="flex items-center justify-end w-[400px] h-[150px] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/HIGHER_button.svg)`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div tw="flex mr-8">
                    <TokenBalance
                      token={player?.award_token_balances?.higher}
                      currency={" "}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div tw="flex flex-col">
              <div tw="flex">
                <div
                  tw="flex items-center justify-end w-[400px] h-[150px] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/TYBG_button.svg)`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div tw="flex mr-8">
                    <TokenBalance
                      token={player?.award_token_balances?.tybg}
                      currency={" "}
                    />
                  </div>
                </div>
              </div>
              <div tw="flex">
                <div
                  tw="flex items-center justify-end w-[400px] h-[150px] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/CH13_button.svg)`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div tw="flex mr-8">
                    <TokenBalance token={player?.ch13_points} currency={" "} />
                  </div>
                </div>
              </div>
            </div>
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

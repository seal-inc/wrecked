import { getOrCreateUserWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const TokenBalance = ({ token, currency }) => {
  const balance = (currency || "") + Number(token || 0).toLocaleString();
  return (
    <span
      tw={`flex text-blue ${
        balance.length > 6
          ? "text-xs"
          : balance.length > 4
          ? "text-lg"
          : "text-2xl"
      }`}
    >
      {balance}
    </span>
  );
};

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const playerId = urlParams.get("playerId");

  const player = await getOrCreateUserWithId(playerId);

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
        <div tw="flex flex-row justify-around mb-16 w-full">
          <div
            tw="flex items-center justify-end w-[60] h-[25] bg-black bg-opacity-50 rounded-lg"
            style={{
              backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/GAS TANK_button.svg)`,
              backgroundsize: "100 200",
            }}
          >
            <div tw="flex mr-8">
              <TokenBalance
                token={player?.play_token_balances?.usdc}
                currency={"$"}
              />
            </div>
          </div>
          <div tw="flex">
            <div tw="flex flex-col">
              <div tw="flex">
                <div
                  tw="flex items-center justify-end w-[60] h-[25] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/DEGEN_button.svg)`,
                    backgroundsize: "100 200",
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
                  tw="flex items-center justify-end w-[60] h-[25] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/HIGHER_button.svg)`,
                    backgroundsize: "100 200",
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
                  tw="flex items-center justify-end w-[60] h-[25] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/TYBG_button.svg)`,
                    backgroundsize: "100 200",
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
                  tw="flex items-center justify-end w-[60] h-[25] bg-black bg-opacity-50 rounded-lg"
                  style={{
                    backgroundImage: `url(${process.env.APP_URL}/artifacts/icons-play/CH13_button.svg)`,
                    backgroundsize: "100 200",
                  }}
                >
                  <div tw="flex mr-8">
                    <TokenBalance
                      token={player?.award_token_balances?.ch13}
                      currency={" "}
                    />
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

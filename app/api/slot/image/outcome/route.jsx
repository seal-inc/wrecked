import { getPlayWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const urlParams = new URLSearchParams(req.url);
  const playId = urlParams.get("playId");
  const play = await getPlayWithId(playId);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col justify-center items-center w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/outcome.jpg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div tw="flex h-1/2 w-1/2 mt-80 ml-[30px] justify-center">
          <img
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 1"]}.jpg`}
            height={280}
            width={166}
          ></img>
          <img
            tw="mx-[12px]"
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 2"]}.jpg`}
            height={280}
            width={166}
          ></img>
          <img
            src={`${process.env.APP_URL}/artifacts/wheel/${play.combination["Reel 3"]}.jpg`}
            height={280}
            width={166}
          ></img>
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

import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-around w-full h-full"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/artifacts/init.gif)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <img
          src={`${process.env.APP_URL}/artifacts/DEGEN_token.svg`}
          height={100}
          width={100}
          alt="description"
        />
      </div>
    ),
    {
      headers: {
        type: "image/gif",
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

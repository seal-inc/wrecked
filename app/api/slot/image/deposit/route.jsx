import { getGameWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const gameId = req.nextUrl.searchParams.get("gameId");
  const playerId = req.nextUrl.searchParams.get("playerId");
  const game = await getGameWithId(gameId);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-around w-full h-full p-[3rem]"
        style={{
          // backgroundImage: `url(${process.env.APP_URL}/wrecked.jpeg)`,
          backgroundSize: "100% 100%",
        }}
      >
        <div
          tw="flex flex-col rounded-[3rem] p-[0.5rem] w-4/5 text-center"
          style={{
            backgroundColor: "white",
            opacity: "0.8",
            color: "black",
          }}
          key={Math.random()}
        >
          {!game.active && (
            <p
              tw="flex flex-col break-words text-center"
              style={{
                fontFamily: "'Audiowide', monospace",
                fontWeight: 400,
                fontSize: "2.5rem",
                lineHeight: "3rem",
              }}
            >
              Game not active! Follow MemeMania channel for more games!
            </p>
          )}
          {game.active && (
            <p
              tw="flex flex-col break-words text-center"
              style={{
                fontFamily: "'Audiowide', monospace",
                fontWeight: 400,
                fontSize: "2.5rem",
                lineHeight: "3rem",
              }}
            >
              Deposit to play!
            </p>
          )}
        </div>
      </div>
    ),
    {
      headers: {
        key: "Cache-Control",
        value: "public, max-age=1, must-revalidate",
      },
      fonts: fonts,
    }
  );
};

export const GET = handleRequest;
export const POST = handleRequest;

import { getGameWithId, getPlayWithId } from "@/components/db/query";
import { fonts } from "@/components/game/fonts";
import { ImageResponse } from "next/og";

const handleRequest = async (req) => {
  const playId = req.nextUrl.searchParams.get("playId");
  const play = await getPlayWithId(playId);
  const game = await getGameWithId(play.game);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-around w-full h-full p-[3rem]"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/wrecked.jpeg)`,
          backgroundSize: "100% 100%",
        }}
      >
        <div
          tw="flex flex-col rounded-[3rem] p-[0.3rem] w-4/5 items-center"
          style={{
            backgroundColor: "white",
            opacity: "0.8",
            color: "black",
          }}
          key={Math.random()}
        >
          <p
            tw="flex flex-col break-words text-center"
            style={{
              fontFamily: "'Audiowide', monospace",
              fontWeight: 400,
              fontSize: "2.5rem",
              lineHeight: "3rem",
            }}
          >
            {play.amount_won > 0 ? "You won! 🔥🔥🔥" : "Better luck next time!"}
          </p>
        </div>
        <div
          tw="flex flex-col rounded-[3rem] p-[0.5rem] w-4/5"
          style={{
            backgroundColor: "white",
            opacity: "0.8",
            color: "black",
          }}
          key={Math.random()}
        >
          <p
            tw="flex flex-col break-words text-center"
            style={{
              fontFamily: "'Audiowide', monospace",
              fontWeight: 400,
              fontSize: "2.5rem",
              lineHeight: "3rem",
            }}
          >
            {play.amount_won > 0
              ? `You won ${play.amount_won} ${game.currency_symbol}! It's in your wallet now!`
              : `Try again the jackpot is even bigger now with ${game.current_prize} ${game.currency_symbol}`}
          </p>
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

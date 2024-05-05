import { Button } from "frames.js/next";
import { getGameWithId } from "../db/query";
import { fonts } from "../game/fonts";

export const Intro = async ({ gameId, ctx }) => {
  // Get the game with the specific id
  const game = await getGameWithId(gameId);
  return {
    image: (
      <div
        tw="flex flex-col items-center justify-around w-full h-full p-[3rem]"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/wrecked.jpg)`,
          backgroundSize: "cover",
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
            WRECKED - SLOT MACHINA
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
            Try your luck to win the jackpot of more than {game.base_prize}{" "}
            {game.currency_symbol}
          </p>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ query: { value: "Play", id: gameId } }}>
        Play
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1.91:1",
    },
  };
};

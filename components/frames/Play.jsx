import {
  createAndGetPlay,
  getGameWithId,
  getOrCreateUserWithId,
} from "../db/query";
import { Button } from "frames.js/next";
import { checkFollower } from "../game/utils";
import { fonts } from "../game/fonts";

export const Play = async ({ gameId, ctx }) => {
  console.log("Play", gameId, ctx.message?.requesterFid);
  const game = await getGameWithId(gameId);
  const player = await getOrCreateUserWithId(ctx.message?.requesterFid);
  const play = await createAndGetPlay(player, game);
  const checkFollow = await checkFollower(ctx.message?.requesterFid, "kramer");

  if (!checkFollow) {
    return {
      image: <span>Follow Wrecked channel to play</span>,
      buttons: [
        <Button action="post" target={{ query: { value: "Play", id: gameId } }}>
          Try again
        </Button>,
      ],
    };
  } else if (!game) {
    return {
      image: <span>Game not found</span>,
    };
  } else if (!game.active) {
    return {
      image: <span>Game not active! Follow Wrecked channel to </span>,
    };
  } else {
    return {
      image: (
        <div
          tw="flex flex-col items-center justify-around w-full h-full p-[3rem]"
          // style={{
          //   backgroundImage: `url(${process.env.APP_URL}/wrecked.jpg)`,
          //   backgroundSize: "cover",
          // }}
        >
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
              Play to win a jackpot of {game.current_prize} {game.currency}{" "}
            </p>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="tx"
          target={{
            pathname: "/tx-data",
            query: { id: gameId, playId: play.id },
          }}
          post_url={{
            pathname: "/",
            query: { id: gameId, playId: play.id },
          }}
        >
          Buy ticket
        </Button>,
      ],
      imageOptions: {
        fonts: fonts,
        aspectRatio: "1.91:1",
      },
    };
  }
};

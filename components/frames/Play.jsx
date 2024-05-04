import {
  createAndGetPlay,
  getGameWithId,
  getOrCreateUserWithId,
} from "../db/query";
import { Button } from "frames.js/next";
import { checkFollower } from "../game/utils";

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
        <span>
          Play to win a jackpot of {game.current_prize} {game.currency}{" "}
        </span>
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
    };
  }
};

import {
  getGameWithId,
  getPlayWithId,
  updateGameBalance,
  updateGameWinner,
  updatePlay,
} from "../db/query";

export async function executePlay(ctx, transaction_hash) {
  let play = await getPlayWithId(ctx.searchParams.playId);
  let game = await getGameWithId(play.game);

  if (!play.transaction_hash && !game.winner && game.active) {
    const randomGuess = Math.floor(Math.random() * 1000);
    if (randomGuess === game.current_prize) {
      try {
        game = await updateGameWinner(game.id, play.id);
        play = await updatePlay(play.id, transaction_hash, true);
        //Pay the winner
      } catch (error) {
        play = await updatePlay(play.id, transaction_hash, false);
      }
    } else {
      play = await updatePlay(play.id, transaction_hash, false);
      game = await updateGameBalance(
        game.id,
        game.base_cost_of_play,
        game.current_prize
      );
    }
  }
  return { play, game };
}

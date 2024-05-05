import {
  getGameWithId,
  getPlayWithId,
  updateGameBalance,
  updatePlay,
} from "../db/query";

export async function executePlay(ctx, transaction_hash) {
  let play = await getPlayWithId(ctx.searchParams.playId);
  let game = await getGameWithId(play.game);

  if (!play.transaction_hash && !game.winner && game.active) {
    const randomGuess = Math.random();
    let amountWon = 0;
    if (randomGuess < 1 / game.current_prize) {
      amountWon = game.current_prize;
    } else if (randomGuess < 0.025) {
      amount = game.current_prize * 16;
    } else if (randomGuess < 0.05) {
      amountWon = game.base_cost_of_play * 8;
    } else if (randomGuess < 0.1) {
      amountWon = game.base_cost_of_play * 4;
    } else if (randomGuess < 0.25) {
      amountWon = game.base_cost_of_play * 2;
    } else {
      amountWon = 0;
    }
    updatePlay(play.id, transaction_hash, amountWon > 0, amountWon);
    amountWon === 0 &&
      updateGameBalance(game.id, game.base_cost_of_play, game.current_prize);
  }

  return { play, game };
}

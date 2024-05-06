import {
  getGameWithId,
  getPlayWithId,
  updateGameBalance,
  updatePlay,
} from "../db/query";
import { payWinnerAmount, publicClient } from "./utils";

export async function executePlay(ctx, transaction_hash) {
  const transaction = await publicClient.waitForTransactionReceipt({
    hash: transaction_hash,
  });
  // TODO: Check if the transction is valid

  let play = await getPlayWithId(ctx.searchParams.playId);
  let game = await getGameWithId(play.game);

  if (!play.transaction_hash && !game.winner && game.active) {
    const randomGuess = Math.random();
    console.log({ randomGuess, current_prize: game.current_prize });
    let amountWon = 0;
    if (randomGuess < 1 / game.current_prize) {
      amountWon = game.current_prize;
    } else if (randomGuess < 0.05) {
      amountWon = game.current_prize * 16;
    } else if (randomGuess < 0.1) {
      amountWon = game.base_cost_of_play * 8;
    } else if (randomGuess < 0.2) {
      amountWon = game.base_cost_of_play * 4;
    } else if (randomGuess < 0.4) {
      amountWon = game.base_cost_of_play * 2;
    }
    console.log({ amountWon, randomGuess });
    await updatePlay(
      play.id,
      transaction_hash,
      amountWon > 0,
      amountWon,
      transaction.from
    );
    amountWon && payWinnerAmount(transaction.from, amountWon, game);
    amountWon === 0 &&
      (await updateGameBalance(
        game.id,
        game.base_cost_of_play,
        game.current_prize
      ));
  }
  return { play, game };
}

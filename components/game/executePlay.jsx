import { updateGameBalance, updatePlay } from "../db/query";
import { payWinnerAmount, publicClient } from "./utils";

export async function executePlay(transaction_hash, game, playId) {
  const transaction = await publicClient.waitForTransactionReceipt({
    hash: transaction_hash,
  });
  // TODO: Check if the transction is valid

  // let play = await getPlayWithId(ctx.searchParams.playId);
  // let game = await getGameWithId(play.game);

  // if (!play.transaction_hash && !game.winner && game.active) {
  const randomGuess = Math.random();
  let amountWon = 0;
  if (randomGuess < 1 / game.current_prize) {
    amountWon = game.current_prize;
  } else if (randomGuess < 0.030625) {
    amountWon = game.current_prize * 16;
  } else if (randomGuess < 0.06125) {
    amountWon = game.base_cost_of_play * 8;
  } else if (randomGuess < 0.125) {
    amountWon = game.base_cost_of_play * 4;
  } else if (randomGuess < 0.25) {
    amountWon = game.base_cost_of_play * 2;
  }
  console.log({ amountWon, randomGuess });
  await updatePlay(
    playId,
    transaction_hash,
    amountWon > 0,
    amountWon,
    transaction.from
  );
  amountWon && (await payWinnerAmount(transaction.from, amountWon, game));
  amountWon === 0 &&
    (await updateGameBalance(
      game.id,
      game.base_cost_of_play,
      game.current_prize
    ));
  // }
  return { amountWon };
}

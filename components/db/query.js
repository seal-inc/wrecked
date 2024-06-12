import { getUserDataForFid } from "frames.js";
import { supabase } from "./server";

export const getGameWithId = async (id) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createAndGetPlay = async (player, game) => {
  const { data, error } = await supabase
    .from("plays")
    .insert([{ player: player.id, game: game.id }])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createSession = async (playerId, wallet, amount) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([
      { player: playerId, initial_deposit: amount, connected_wallet: wallet },
    ])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getPlayWithId = async (id) => {
  const { data, error } = await supabase
    .from("plays")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateGameWinner = async (gameId, winner) => {
  const { data, error } = await supabase
    .from("games")
    .update({ winner })
    .eq("id", gameId)
    .is("winner", null)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateGameBalance = async (
  gameId,
  base_cost_of_play,
  current_prize
) => {
  const { data, error } = await supabase
    .from("games")
    .update({ current_prize: current_prize + base_cost_of_play * 0.5 })
    .eq("id", gameId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const updatePlay = async (
  playId,
  transaction_hash,
  has_won,
  amount_won,
  wallet
) => {
  console.log({ playId, transaction_hash, has_won, amount_won, wallet });
  const { data, error } = await supabase
    .from("plays")
    .update({ transaction_hash, has_won, amount_won, wallet })
    .eq("id", playId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export async function getOrCreateUserWithId(fid) {
  // Step 1: Attempt to retrieve the record
  let { data: retrievedData, error: retrieveError } = await supabase
    .from("players")
    .select("*")
    .eq("id", fid)
    .single();

  // Step 2: If the record exists, return it
  if (retrievedData) {
    return retrievedData;
  }
  const userData = await getUserDataForFid({ fid });
  const data = { id: fid, username: userData?.username };

  // Step 3: If the record does not exist, insert a new one
  if (retrieveError) {
    let { data: createdData, error: createError } = await supabase
      .from("players")
      .insert([data])
      .select()
      .single();

    if (createError) {
      throw createError;
    }
    // Step 4: Return the newly created record
    return createdData;
  }
}

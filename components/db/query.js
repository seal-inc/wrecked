import { getUserDataForFid } from "frames.js";
import { supabase } from "./server";

export const registerPlay = async (
  playerId,
  sessionId,
  playAmount,
  combination,
  totalWinnings,
  payoutToken,
  payoutTokenAmount
) => {
  const { data, error } = await supabase
    .from("plays")
    .insert([
      {
        player: playerId,
        session: sessionId,
        combination,
        play_amount_usdc: playAmount,
        won_amount_usdc: totalWinnings,
        award_token_balance: { [payoutToken]: payoutTokenAmount },
      },
    ])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getSessionWithId = async (id) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const createSession = async (playerId) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ player: playerId }])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createDeposit = async (
  playerId,
  amount,
  sessionId,
  transactionHash
) => {
  const { data, error } = await supabase
    .from("deposits")
    .insert([
      {
        player: playerId,
        amount,
        session: sessionId,
        transaction_hash: transactionHash,
      },
    ])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateSession = async (sessionId, newSessionInfo) => {
  const { data, error } = await supabase
    .from("sessions")
    .update(newSessionInfo)
    .eq("id", sessionId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const updatePlayerAccount = async (playerId, newPlayerInfo) => {
  const { data, error } = await supabase
    .from("players")
    .update(newPlayerInfo)
    .eq("id", playerId)
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

export const updatePlayWithId = async (id, newPlayerInfo) => {
  const { data, error } = await supabase
    .from("plays")
    .update(newPlayerInfo)
    .eq("id", id)
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

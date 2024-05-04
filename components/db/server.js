import { createClient } from "@supabase/supabase-js";

// Ensure that the process.env.NEXT_PUBLIC_SUPABASE_URL variable is defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || "", supabaseSecretKey);

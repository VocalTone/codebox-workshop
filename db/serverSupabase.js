const { createClient } = require("@supabase/supabase-js");

const serverKey = process.env.SUPABASE_SECRET_KEY;

if (!serverKey) {
  throw new Error("SUPABASE_SECRET_KEY must be set for server-side book review access");
}

const serverSupabase = createClient(process.env.SUPABASE_URL, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = serverSupabase;

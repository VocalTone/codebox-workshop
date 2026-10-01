const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const supabase = require("../db/serverSupabase");

async function register({ username, password, name }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = { user_id: randomUUID(), username, password_hash: passwordHash, name: name || username };
  const { data, error } = await supabase.from("users").insert(user).select("user_id, username, name").single();
  if (error) throw error;
  return data;
}

async function findForLogin(username) {
  const { data, error } = await supabase.from("users").select("user_id, username, name, password_hash").eq("username", username).maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = { findForLogin, register };

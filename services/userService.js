const supabase = require("../db/supabase");

async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

async function findUserById(id) {
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getUsers, findUserById };

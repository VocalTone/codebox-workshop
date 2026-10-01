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

async function createUser(user) {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select("id, name")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateUser(id, name) {
  const { data, error } = await supabase
    .from("users")
    .update({ name })
    .eq("id", id)
    .select("id, name")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteUser(id) {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select("id, name")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { createUser, deleteUser, findUserById, getUsers, updateUser };

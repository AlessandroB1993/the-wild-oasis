import supabase, { supabaseUrl } from "./supabase.js";

export async function signup({ fullName, email, password }) {
  // Save the current session before signing up a new user
  const { data: savedSessionData } = await supabase.auth.getSession();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  // If there was a previously authenticated user, restore their session
  // This action should be placed right after signUp, otherwise the authError will stop the restoring
  if (savedSessionData)
    await supabase.auth.setSession(savedSessionData.session);

  // Handle errors
  let authError = null;
  if (error) {
    error.message.includes("already")
      ? (authError = {
          name: error.name,
          message: error.message + ". Please use a different email address.",
        })
      : (authError = { name: error.name, message: error.message });
  }

  if (authError) throw new Error(authError.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  // Necessary to re-fetch for security reason, so we don't get the session locally
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ fullName, password, avatar }) {
  // 1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = supabase.storage
    .from("avatars")
    .upload(fileName, avatar, { upsert: true });

  console.log(data);

  if (storageError) throw new Error(error.message);

  // 3. Update avatar in the user
  const { data: updatedUser, error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars//${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);

  // 4. Get the old avatar name and delete it from storage
  const avatarName = data.user.user_metadata.avatar.split("/").at(-1);
  const { avatarError } = await supabase.storage
    .from("avatars")
    .remove(avatarName);

  if (avatarError) throw new Error(avatarError.message);

  return updatedUser;
}

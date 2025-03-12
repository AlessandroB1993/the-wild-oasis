import supabase, { supabaseUrl } from "./supabase.js";

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");

  // CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id); // only where the filed of id is equal to the id we pass in

  // The async operation actually starts here
  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }

  // 2. Upload image
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    // 3. Delete cabin IF there was an error uploading the image
    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and cabin was not created"
      );
    }
  }

  return data;
}

export async function deleteCabin(id, imageName) {
  // 1. Read cabin data for this id, to be used reverting the data if failed deleting the image
  const { data: cabin, error: cabinReadError } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id);

  if (cabinReadError)
    throw new Error("Can't retrieve cabin information from database");

  const imgFileName = cabin[0].image.split("/").at(-1);
  const backupCabinData = cabin[0];

  // Check if another cabin at least uses the same image before removing it from DB
  const { data: cabinWithSameImg, imagesError } = await supabase
    .from("cabins")
    .select("image")
    .eq("image", imageName);

  if (imagesError) {
    console.error(imagesError);
    throw new Error("Cabins could not be deleted");
  }

  // 2. Delete the cabin item from DB cabins table
  const { error: cabinDeleteError } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (cabinDeleteError) {
    console.error(cabinDeleteError);
    throw new Error("Cabins could not be deleted");
  }

  // 3. Delete image from DB bucket if there is only one cabin with that same image, avoiding leaving copies of cabin without it
  if (cabinWithSameImg.length === 1) {
    const { error: fileRemoveError } = await supabase.storage
      .from("cabin-images")
      .remove([imgFileName]);

    if (fileRemoveError) {
      createEditCabin(backupCabinData);
      console.error(fileRemoveError);
      throw new Error(
        "Ecountered a problem in removing the cabin image. Cabin did not get deleted"
      );
    }
  }
}

// export async function deleteCabin(id) {
//   const { error } = await supabase.from("cabins").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Cabins could not be deleted");
//   }
// }

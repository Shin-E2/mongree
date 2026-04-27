"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase-server";

export const logOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

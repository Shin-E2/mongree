"use server";

import { notFound } from "next/navigation";
import db from "./db";
import { getSession } from "./session";

export async function getUser() {
  const session = await getSession();

  if (!session.id) {
    notFound();
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (!user) {
    notFound();
  }

  return user;
}

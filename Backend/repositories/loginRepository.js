import prisma from "../lib/prisma.js";

export const check = async (username) => {
  const existing = await prisma.accounts.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
    },
  });

  if (!existing) {
    return { ok: false };
  } else {
    return { ok: true };
  }
};

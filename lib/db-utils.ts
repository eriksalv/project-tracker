import { Prisma } from "@prisma/client";

export const userArgs: Prisma.UserArgs = {
  select: {
    email: true,
    username: true,
    id: true,
    name: true,
  },
};

export const projectArgs: Prisma.ProjectArgs = {
  include: {
    owner: userArgs,
  },
};

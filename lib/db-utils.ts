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

export const projectWithBoardArgs: Prisma.ProjectArgs = {
  include: {
    owner: userArgs,
    board: {
      select: {
        id: true,
        issues: true,
        contributors: {
          select: {
            userId: true,
          },
        },
      },
    },
  },
};

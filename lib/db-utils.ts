import { Prisma } from "@prisma/client";
import prisma from "./prisma";

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
        contributors: {
          select: {
            user: userArgs,
          },
        },
      },
    },
  },
};

export const issueArgs: Prisma.IssueArgs = {
  include: {
    creator: userArgs,
    assignee: userArgs,
  },
};

export async function isContributor(
  userId: number,
  boardId: number
): Promise<boolean> {
  return !!(await prisma.contribution.findUnique({
    where: {
      userId_boardId: { userId, boardId },
    },
  }));
}

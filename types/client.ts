import {
  Board as PrismaBoard,
  Project as PrismaProject,
  User as PrismaUser,
  Issue as PrismaIssue,
  Contribution as PrismaContribution,
} from "@prisma/client";

export type User = Omit<PrismaUser, "password">;

export type Issue = PrismaIssue & {
  creator: Omit<User, "createdAt" | "updatedAt"> | null;
  assignee: Omit<User, "createdAt" | "updatedAt"> | null;
};

export type Board = Pick<PrismaBoard, "id"> & {
  contributors: [{ user: User }];
};

export type Project = PrismaProject & { owner: User } & { board: Board };

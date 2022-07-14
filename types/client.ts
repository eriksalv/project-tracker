import {
  Board as PrismaBoard,
  Project as PrismaProject,
  User as PrismaUser,
  Issue as PrismaIssue,
  Contribution as PrismaContribution,
} from "@prisma/client";

export type User = Omit<PrismaUser, "password">;

export type Board = Pick<PrismaBoard, "id"> & {
  issues: Pick<PrismaIssue, "id" | "title" | "status" | "priority">;
};

export type Project = PrismaProject & { owner: User } & { board: Board } & {
  contributors: Pick<PrismaContribution, "userId">;
};

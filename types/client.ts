import {
  Board as PrismaBoard,
  Project as PrismaProject,
  User as PrismaUser,
  Issue as PrismaIssue,
  Contribution as PrismaContribution,
  Comment as PrismaComment,
} from "@prisma/client";

export type User = Omit<PrismaUser, "password" | "createdAt" | "updatedAt">;

export type Issue = PrismaIssue & {
  creator: Omit<User, "createdAt" | "updatedAt"> | null;
  assignee: Omit<User, "createdAt" | "updatedAt"> | null;
  comments: PrismaComment[];
};

export type Contributor = PrismaContribution & { user: User };

export type Board = Pick<PrismaBoard, "id"> & {
  contributors: Contributor[];
};

export type Project = PrismaProject & { owner: User } & { board: Board };

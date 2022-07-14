import { Project as PrismaProject, User as PrismaUser } from "@prisma/client";

export interface User extends Omit<PrismaUser, "password"> {}

export interface Project extends PrismaProject {
  owner: User;
}

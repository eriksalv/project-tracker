import { Project as PrismaProject } from "@prisma/client";

export interface User {
  email: string;
  username: string;
  id: number;
  name: string | null;
}

export interface Project extends PrismaProject {
  owner: User;
}

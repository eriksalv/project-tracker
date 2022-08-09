import { Board, Issue, Project } from "@prisma/client";
import { NextApiRequest } from "next";
import { User } from "./client";

export interface ExtendedNextApiRequest extends NextApiRequest {
  data?: any;
  user?: User;
  issue?: Issue;
  board?: Board;
  project?: Project;
}

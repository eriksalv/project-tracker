import * as yup from "yup";
import { Issue, Priority, Status } from "@prisma/client";

export interface CreateIssueForm {
  title: Issue["title"];
  description?: Issue["description"];
  priority: Priority;
  status: Status;
  assigneeId?: Issue["assigneeId"];
}

export const createIssueSchema: yup.SchemaOf<CreateIssueForm> = yup
  .object()
  .shape({
    title: yup.string().trim().min(1).max(20).required(),
    description: yup.string().trim().max(200).nullable(true),
    priority: yup.mixed<Priority>().oneOf(Object.values(Priority)).required(),
    status: yup.mixed<Status>().oneOf(Object.values(Status)).required(),
    assigneeId: yup.number().nullable(true),
  });

export interface UpdateIssueForm {
  title?: Issue["title"];
  description?: Issue["description"];
  priority?: Priority;
  status?: Status;
  assigneeId?: Issue["assigneeId"];
}

export const updateIssueSchema: yup.SchemaOf<UpdateIssueForm> = yup
  .object()
  .shape({
    title: yup.string().trim().min(1).max(20),
    description: yup.string().trim().max(200).nullable(true),
    priority: yup.mixed<Priority>().oneOf(Object.values(Priority)),
    status: yup.mixed<Status>().oneOf(Object.values(Status)),
    assigneeId: yup.number().nullable(true),
  });

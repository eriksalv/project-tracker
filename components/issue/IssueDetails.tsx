import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  MediaQuery,
  NativeSelect,
  Select,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIssue, IssueResponse, updateIssue } from "../../lib/queries/issues";
import useAuthStore from "../../store/auth";
import { getIcon } from "../project/Issue";
import ReactMarkdown from "react-markdown";
import useProjectStore from "../../store/project";
import { Edit, X, DeviceFloppy, Markdown, Check } from "tabler-icons-react";
import { User } from "../../types/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateIssueForm, updateIssueSchema } from "../../lib/validation/issue";
import { useForm } from "react-hook-form";
import { showNotification } from "@mantine/notifications";
import { showError, showSuccess } from "../../lib/notifications";
import { Priority, Status } from "@prisma/client";

const IssueDetails = () => {
  const router = useRouter();

  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");

  const [assignee, setAssignee] = useState<number | "">("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<Priority | undefined>(undefined);

  const [status, setStatus] = useState<Status | undefined>(undefined);

  const { user } = useAuthStore();

  const { project } = useProjectStore();

  const { id: projectId, issueId } = router.query;

  const { data, status: issueStatus } = useQuery<IssueResponse, Error>(
    ["issues", projectId, issueId],
    () => getIssue(projectId, issueId),
    {
      enabled: projectId !== undefined && issueId !== undefined,
      onSuccess: (data) => {
        setTitle(data.issue?.title!);
        setPriority(data.issue?.priority!);
        setStatus(data.issue?.status!);
        setAssignee(data?.issue?.assignee?.id || "");
        setDescription(data?.issue?.description || "");
      },
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const issue = data?.issue;

  const isLoading = issueStatus === "loading" || !issue;

  const queryClient = useQueryClient();

  const formOptions = { resolver: yupResolver(updateIssueSchema) };

  const { register, handleSubmit, formState } =
    useForm<UpdateIssueForm>(formOptions);
  const { errors } = formState;

  const { mutate, isLoading: updateIsLoading } = useMutation(
    async (data: UpdateIssueForm) =>
      await updateIssue(issueId, projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["issues", projectId, issueId]);

        setEditing(false);

        showNotification({
          ...showSuccess("Issue updated successfully", "update-issue"),
          icon: <Check size={16} />,
        });
      },
      onError: (error) => {
        setEditing(false);

        showNotification(showError(error, "update-issue"));
      },
    }
  );

  const onSubmit = () => {
    const data = {
      title,
      assigneeId: assignee || null,
      description,
      priority: priority,
      status,
    };

    mutate(data);
  };

  if (isLoading) {
    return <Skeleton height="500px" sx={{ maxWidth: "960px" }} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Group>
        {editing ? (
          <TextInput
            size="xl"
            radius="xl"
            value={title}
            id="title"
            {...register("title")}
            error={errors.title?.message}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <Text sx={{ fontWeight: "normal", fontSize: "2.5rem" }}>
            {issue.title}
          </Text>
        )}
        <Text color="dimmed" sx={{ fontWeight: "normal", fontSize: "2.5rem" }}>
          #{issue.id}
        </Text>
      </Group>
      <Group sx={{ justifyContent: "space-between" }}>
        <Group>
          {getIcon(issue)}
          <Text sx={{ display: "flex", gap: "5px" }}>
            <Text
              weight={700}
              sx={{
                "&:hover": { textDecoration: "underline", cursor: "pointer" },
              }}
              onClick={() => router.push(`/users/${issue.creatorId}`)}
            >
              {issue.creator?.username}
            </Text>
            <span>
              {" "}
              {`opened on ${moment(issue.createdAt).format("ll")} | ${
                issue.comments.length
              } comments`}
            </span>
          </Text>
        </Group>
        {user &&
          project &&
          project.board.contributors.find(
            (contributor: { user: User }) => user.id === contributor.user.id
          ) && (
            <Group>
              <Button
                size="sm"
                radius="xl"
                variant={editing ? "filled" : "outline"}
                color={editing ? "orange" : "blue"}
                rightIcon={editing ? <X /> : <Edit />}
                onClick={() => {
                  setTitle(issue.title);
                  setPriority(issue.priority);
                  setStatus(issue.status);
                  setDescription(issue.description || "");
                  setAssignee(issue.assigneeId || "");
                  setEditing(!editing);
                }}
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
              {editing && (
                <Button
                  color="teal"
                  size="sm"
                  radius="xl"
                  rightIcon={<DeviceFloppy />}
                  onClick={handleSubmit(onSubmit)}
                  loading={updateIsLoading}
                >
                  Save
                </Button>
              )}
            </Group>
          )}
      </Group>
      <Divider sx={{ margin: "1rem 0" }} />

      {/* Issue description */}
      <Title order={3} sx={{ marginBottom: "0.5rem" }}>
        Description
      </Title>
      <MediaQuery smallerThan="sm" styles={{ display: "block" }}>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Box sx={{ flex: 7 }}>
            {editing ? (
              <Textarea
                id="description"
                {...register("description")}
                error={errors.description?.message}
                onChange={(e) => setDescription(e.target.value)}
                autosize
                minRows={5}
                maxRows={10}
                value={description}
              />
            ) : (
              <Card shadow="md">
                <ReactMarkdown>{issue.description || ""}</ReactMarkdown>
              </Card>
            )}
            {editing && (
              <Text
                size="sm"
                color="dimmed"
                sx={{
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <Markdown />
                Markdown supported
              </Text>
            )}
          </Box>
          <MediaQuery smallerThan="sm" styles={{ marginTop: "0.5rem" }}>
            <Stack spacing="xs" sx={{ flex: 2 }}>
              <Text weight="bold">Assignee</Text>
              {project && editing ? (
                <NativeSelect
                  id="assignee"
                  placeholder="Unassigned"
                  datatype="number"
                  value={String(assignee)}
                  data={[
                    ...project.board.contributors.map((c) => ({
                      value: String(c.user.id),
                      label: c.user.username,
                    })),
                    { value: "", label: "Unassigned" },
                  ]}
                  {...register("assigneeId")}
                  error={errors.assigneeId?.message}
                  onChange={(event) =>
                    setAssignee(
                      event.currentTarget.value
                        ? parseInt(event.currentTarget.value)
                        : ""
                    )
                  }
                />
              ) : (
                <Link href={`/users/${issue.assigneeId}`} passHref>
                  <Text
                    component="a"
                    sx={{ "&:hover": { textDecoration: "underline" } }}
                  >
                    {issue.assignee?.username}
                  </Text>
                </Link>
              )}
              <Divider />
              <Text weight="bold">Priority</Text>
              {editing ? (
                <NativeSelect
                  id="priority"
                  data={[
                    { value: "LOW", label: "Low" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HIGH", label: "High" },
                  ]}
                  {...register("priority")}
                  error={errors.priority?.message}
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.currentTarget.value as Priority)
                  }
                />
              ) : (
                <Text>{issue.priority}</Text>
              )}
              <Divider />
              <Text weight="bold">Status</Text>
              {editing ? (
                <NativeSelect
                  id="status"
                  data={[
                    { value: "OPEN", label: "Open" },
                    { value: "IN_PROGRESS", label: "In Progress" },
                    { value: "DONE", label: "Done" },
                  ]}
                  {...register("status")}
                  error={errors.status?.message}
                  value={status}
                  onChange={(event) =>
                    setStatus(event.currentTarget.value as Status)
                  }
                />
              ) : (
                <Text>{issue.status}</Text>
              )}
            </Stack>
          </MediaQuery>
        </Box>
      </MediaQuery>
      <Divider sx={{ margin: "1rem 0" }} />
    </Box>
  );
};

export default IssueDetails;

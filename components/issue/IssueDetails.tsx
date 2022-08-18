import {
  Avatar,
  Box,
  Card,
  Divider,
  Group,
  Skeleton,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getIssue, IssueResponse } from "../../lib/queries/issues";
import useAuthStore from "../../store/auth";
import { getIcon } from "../project/Issue";
import ReactMarkdown from "react-markdown";

const replaceWithBr = (text: string) => {
  return text.replace(/\n/g, "<br />");
};

const IssueDetails = () => {
  const router = useRouter();

  const { user } = useAuthStore();

  const { id: projectId, issueId } = router.query;

  const { data, status } = useQuery<IssueResponse, Error>(
    ["issues", projectId, issueId],
    () => getIssue(projectId, issueId),
    {
      enabled: projectId !== undefined && issueId !== undefined,
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const issue = data?.issue;

  const isLoading = status === "loading" || !issue;

  if (isLoading) {
    return <Skeleton height="500px" />;
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
        <Text sx={{ fontWeight: "normal", fontSize: "2.5rem" }}>
          {issue.title}
        </Text>
        <Text color="dimmed" sx={{ fontWeight: "normal", fontSize: "2.5rem" }}>
          #{issue.id}
        </Text>
      </Group>
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
      <Divider sx={{ margin: "1rem 0" }} />

      {/* Issue description */}
      <Box>
        <Title order={3}>Description</Title>
        <Card shadow="md" sx={{ margin: "0.5rem 0" }}>
          <ReactMarkdown>{issue.description || ""}</ReactMarkdown>
        </Card>
      </Box>
    </Box>
  );
};

export default IssueDetails;

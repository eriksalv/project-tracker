import Link from "next/link";
import React from "react";
import { Issue } from "../../types/client";
import { Circle, CircleHalfVertical, CircleDashed } from "tabler-icons-react";
import { Avatar, Group, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import moment from "moment";

type props = {
  issue: Issue;
};

const getIcon = (issue: Issue) => {
  if (issue.status === "OPEN") {
    return (
      <Tooltip
        transition="pop-bottom-right"
        transitionDuration={100}
        transitionTimingFunction="ease"
        label="Open"
        color="teal"
        withArrow
      >
        <ThemeIcon color="teal" size={24} radius="xl">
          <Circle size={16} />
        </ThemeIcon>
      </Tooltip>
    );
  }
  if (issue.status === "DONE") {
    return (
      <Tooltip
        transition="pop-bottom-right"
        transitionDuration={100}
        transitionTimingFunction="ease"
        label="Done"
        color="gray"
        withArrow
      >
        <ThemeIcon color="gray" size={24} radius="xl">
          <CircleHalfVertical size={16} />
        </ThemeIcon>
      </Tooltip>
    );
  }
  return (
    <Tooltip
      transition="pop-bottom-right"
      transitionDuration={100}
      transitionTimingFunction="ease"
      label="In progress"
      color="blue"
      withArrow
    >
      <ThemeIcon color="blue" size={24} radius="xl">
        <CircleDashed size={16} />
      </ThemeIcon>
    </Tooltip>
  );
};

const Issue: React.FC<props> = ({ issue }) => {
  return (
    <Group
      sx={(theme) => ({
        borderBottom:
          theme.colorScheme === "dark"
            ? `1px solid ${theme.colors.dark[6]}`
            : `1px solid ${theme.colors.gray[3]}`,
        padding: "1rem",
        width: "100%",
        justifyContent: "space-between",
        ":last-child": { border: 0 },
      })}
    >
      <Group>
        {getIcon(issue)}

        <Stack spacing={0}>
          <Link href="/" passHref>
            <Text size="lg" component="a" weight={700}>
              {issue.title}
            </Text>
          </Link>

          <Group p={0}>
            <Text color="dimmed" size="sm">
              {`#${issue.id} opened ${moment(issue.createdAt).fromNow()} by `}
              {issue.creator ? (
                <Link href={`/users/${issue.creatorId}`}>
                  {issue.creator.username || "?"}
                </Link>
              ) : (
                "?"
              )}
            </Text>
          </Group>
        </Stack>
      </Group>

      <Stack spacing={0}>
        {issue.assignee && (
          <Tooltip
            label={`Assigned to ${issue.assignee.username}`}
            transition="pop-bottom-right"
            position="left"
            transitionDuration={100}
            transitionTimingFunction="ease"
            color="teal"
            withArrow
            sx={{ alignSelf: "flex-end" }}
          >
            <Link href={`/users/${issue.assigneeId}`} passHref>
              <Avatar component="a" radius="xl" size="sm" color="teal" />
            </Link>
          </Tooltip>
        )}
        <Text color="dimmed" size="sm">
          {`Updated ${moment(issue.updatedAt).fromNow()}`}
        </Text>
      </Stack>
    </Group>
  );
};

export default Issue;

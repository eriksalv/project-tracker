import {
  ActionIcon,
  Group,
  Loader,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getProject, ProjectResponse } from "../../../lib/queries/projects";
import useProjectStore from "../../../store/project";
import { Star } from "tabler-icons-react";

import classes from "../../../styles/project.module.css";
import IssueList from "../../../components/project/IssueList";

const Project = () => {
  const router = useRouter();
  const { id } = router.query;

  const { setProject } = useProjectStore();

  const { data, status } = useQuery<ProjectResponse, Error>(
    ["projects", id],
    () => getProject(id),
    {
      enabled: id !== undefined,
      onSuccess: (data) => {
        setProject(data?.project!);
      },
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const project = data?.project;

  const isLoading = status === "loading" || !data;

  return (
    <>
      <Skeleton
        visible={isLoading}
        height={isLoading ? "70px" : "auto"}
        sx={{ marginBottom: "1rem" }}
      >
        {project && (
          <>
            <Text className={classes.ownerProject}>
              <div onClick={() => router.push(`/users/${project.owner.id}`)}>
                {project.owner.username}
              </div>
              /<div onClick={() => router.reload()}>{project.title}</div>
            </Text>
            <Group position="apart">
              <Title order={1}>{project.title}</Title>
              <ActionIcon variant="light" radius="xl">
                <Star />
              </ActionIcon>
            </Group>
          </>
        )}
      </Skeleton>

      <IssueList id={id} />
    </>
  );
};

export default Project;

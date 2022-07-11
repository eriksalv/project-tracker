import { ActionIcon, Group, Loader, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getProject, ProjectResponse } from "../../../lib/queries/projects";
import useProjectStore from "../../../store/project";
import { Star } from "tabler-icons-react";

import classes from "../../../styles/project.module.css";

const Project = () => {
  const router = useRouter();
  const { id } = router.query;

  const { setProject } = useProjectStore();

  const { data, status } = useQuery<ProjectResponse, Error>(
    ["projects", id],
    () => getProject(+id! as number),
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

  if (status === "loading" || (!data?.project && status === "idle")) {
    return <Loader />;
  }

  if (status === "success") {
    const { project } = data;

    return (
      <section>
        <Text className={classes.ownerProject}>
          <div onClick={() => router.push(`/users/${project?.owner.id}`)}>
            {project?.owner.username}
          </div>
          /<div onClick={() => router.reload()}>{project?.title}</div>
        </Text>
        <Group position="apart">
          <Title order={1}>{project?.title}</Title>
          <ActionIcon variant="light" radius="xl">
            <Star />
          </ActionIcon>
        </Group>
      </section>
    );
  }

  return <></>;
};

export default Project;

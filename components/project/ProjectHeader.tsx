import { ActionIcon, Group, Skeleton, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getProject, ProjectResponse } from "../../lib/queries/projects";
import useProjectStore from "../../store/project";
import { Star } from "tabler-icons-react";

import classes from "../../styles/project.module.css";
import useAuthStore from "../../store/auth";
import {
  getStar,
  starProject,
  StarResponse,
  unstarProject,
} from "../../lib/queries/stars";

const ProjectHeader = () => {
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();

  const { user } = useAuthStore();

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

  const {
    data: starData,
    status: starStatus,
    refetch,
  } = useQuery(["star", id], () => getStar(id), {
    enabled: id !== undefined,
  });

  // Star and unstar mutations with optimistic updates
  const starMutation = useMutation(
    async (projectId: number) => await starProject(projectId),
    {
      onMutate: async (projectId) => {
        await queryClient.cancelQueries(["star", String(projectId)]);

        const previousStar: StarResponse = queryClient.getQueryData([
          "star",
          String(projectId),
        ])!;

        const newStar: StarResponse = {
          ...previousStar,
          hasStarred: true,
          starCount: previousStar.starCount! + 1,
        };

        queryClient.setQueryData(["star", String(projectId)], newStar);

        return { previousStar, newStar };
      },
      onError: (_err, projectId, context) => {
        queryClient.setQueryData(
          ["star", String(projectId)],
          context?.previousStar
        );
      },
      onSettled: () => {
        refetch();
      },
    }
  );

  const unstarMutation = useMutation(
    async (projectId: number) => await unstarProject(projectId),
    {
      onMutate: async (projectId) => {
        await queryClient.cancelQueries(["star", String(projectId)]);

        const previousStar: StarResponse = queryClient.getQueryData([
          "star",
          String(projectId),
        ])!;
        const newStar: StarResponse = {
          ...previousStar,
          hasStarred: false,
          starCount: previousStar.starCount! - 1,
        };

        queryClient.setQueryData(["star", String(projectId)], newStar);

        return { previousStar, newStar };
      },
      onError: (_err, projectId, context) => {
        queryClient.setQueryData(
          ["star", String(projectId)],
          context?.previousStar
        );
      },
      onSettled: () => {
        refetch();
      },
    }
  );

  const handleStar = () => {
    if (project && starStatus !== "loading" && starData) {
      if (starData.hasStarred) {
        unstarMutation.mutate(project.id);
      } else {
        starMutation.mutate(project.id);
      }
    }
  };

  return (
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
            /
            <div onClick={() => router.push(`/projects/${project.id}`)}>
              {project.title}
            </div>
          </Text>
          <Group position="apart">
            <Title order={1}>{project.title}</Title>
            {user && (
              <ActionIcon
                variant={starData?.hasStarred ? "filled" : "light"}
                color={starData?.hasStarred ? "yellow" : "gray"}
                radius="xl"
                size={32}
                onClick={handleStar}
                sx={{
                  width: "6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Text weight="bold" size="lg">
                  {starData?.starCount}
                </Text>
                <Star
                  color={starData?.hasStarred ? "#fffa86" : "#bdbdbd"}
                  strokeWidth={starData?.hasStarred ? 3 : 2}
                />
              </ActionIcon>
            )}
          </Group>
        </>
      )}
    </Skeleton>
  );
};

export default ProjectHeader;

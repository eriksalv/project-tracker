import { Box, MediaQuery, Skeleton, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import {
  getUserContributions,
  getUserProjects,
  ProjectResponse,
} from "../../lib/queries/projects";
import ProjectList from "./ProjectList";

const UserProjectsOverview = () => {
  const router = useRouter();

  const id = router.query.id;

  const { data: userProjectsData, status: userProjectsStatus } = useQuery<
    ProjectResponse,
    Error
  >("projects", () => getUserProjects(id), {
    enabled: id !== undefined,
    onError: () => {
      router.replace("/404");
    },
  });

  const { data: contributingData, status: contributingStatus } = useQuery<
    ProjectResponse,
    Error
  >("contributing", () => getUserContributions(id), {
    enabled: id !== undefined,
    onError: () => {
      router.replace("/404");
    },
  });

  const userProjects = userProjectsData?.projects;

  const contributing = contributingData?.projects;

  return (
    <Box sx={{ flex: 2 }}>
      <MediaQuery
        largerThan="sm"
        styles={{ paddingLeft: "2rem", marginTop: "100px" }}
      >
        <Box sx={{ width: "100%", paddingTop: "1rem" }}>
          {/* Projects owned */}
          <Stack sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Text weight="bold" size="lg">
                PROJECTS
              </Text>
              <Text
                weight={100}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                View all
              </Text>
            </Box>
            {userProjectsStatus === "loading" || !userProjects ? (
              <Skeleton height={128} width="100%" />
            ) : (
              <ProjectList projects={userProjects} />
            )}
          </Stack>

          {/* Contributing to */}
          <Stack sx={{ width: "100%", marginTop: "1rem" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Text weight="bold" size="lg">
                CONTRIBUTING TO
              </Text>
              <Text
                weight={100}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                View all
              </Text>
            </Box>
            {contributingStatus === "loading" || !contributing ? (
              <Skeleton height={128} width="100%" />
            ) : (
              <ProjectList projects={contributing} />
            )}
          </Stack>
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default UserProjectsOverview;

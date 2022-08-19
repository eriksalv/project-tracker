import {
  Accordion,
  ActionIcon,
  Box,
  Divider,
  Group,
  MediaQuery,
  Skeleton,
  Stack,
  Text,
  Transition,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import {
  getStarredProjects,
  getUserContributions,
  getUserProjects,
  ProjectResponse,
} from "../../lib/queries/projects";
import ProjectList from "./ProjectList";

const UserProjectsOverview = () => {
  // TODO: refactor this and project list pages

  const router = useRouter();

  const id = router.query.id;

  const [userProjectsOpen, setUserProjectsOpen] = useState(true);
  const [contributingOpen, setContributingOpen] = useState(false);
  const [starredOpen, setStarredOpen] = useState(false);

  const { data: userProjectsData, status: userProjectsStatus } = useQuery<
    ProjectResponse,
    Error
  >("projects", () => getUserProjects(id, 3), {
    enabled: id !== undefined,
    onError: () => {
      router.replace("/404");
    },
  });

  const { data: contributingData, status: contributingStatus } = useQuery<
    ProjectResponse,
    Error
  >("contributing", () => getUserContributions(id, 3), {
    enabled: id !== undefined,
    onError: () => {
      router.replace("/404");
    },
  });

  const { data: starredData, status: starredStatus } = useQuery<
    ProjectResponse,
    Error
  >("starred", () => getStarredProjects(id, 3), {
    enabled: id !== undefined,
    onError: () => {
      router.replace("/404");
    },
  });

  const userProjects = userProjectsData?.projects;

  const contributing = contributingData?.projects;

  const starred = starredData?.projects;

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
              <Group
                onClick={() => setUserProjectsOpen(!userProjectsOpen)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                {userProjectsOpen ? <ChevronUp /> : <ChevronDown />}

                <Text weight="bold" size="lg">
                  PROJECTS
                </Text>
              </Group>
              <Link href={`/users/${id}/projects`} passHref>
                <Text
                  component="a"
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
              </Link>
            </Box>
            <Transition
              mounted={userProjectsOpen}
              transition="scale-y"
              duration={100}
              timingFunction="ease"
            >
              {(styles) => (
                <>
                  {(userProjectsOpen && userProjectsStatus === "loading") ||
                  !userProjects ? (
                    <Skeleton height={128} width="100%" style={{ ...styles }} />
                  ) : (
                    <ProjectList projects={userProjects} styles={styles} />
                  )}
                </>
              )}
            </Transition>
          </Stack>

          <Divider sx={{ margin: "1rem 0" }} />

          {/* Contributing to */}
          <Stack sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Group
                onClick={() => setContributingOpen(!contributingOpen)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                {contributingOpen ? <ChevronUp /> : <ChevronDown />}

                <Text weight="bold" size="lg">
                  CONTRIBUTING TO
                </Text>
              </Group>
              <Link href={`/users/${id}/contributions`} passHref>
                <Text
                  component="a"
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
              </Link>
            </Box>
            <Transition
              mounted={contributingOpen}
              transition="scale-y"
              duration={100}
              timingFunction="ease"
            >
              {(styles) => (
                <>
                  {contributingStatus === "loading" || !contributing ? (
                    <Skeleton height={128} width="100%" style={{ ...styles }} />
                  ) : (
                    <ProjectList projects={contributing} styles={styles} />
                  )}
                </>
              )}
            </Transition>
          </Stack>

          <Divider sx={{ margin: "1rem 0" }} />

          {/* Starred projects */}
          <Stack sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Group
                onClick={() => setStarredOpen(!starredOpen)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                {starredOpen ? <ChevronUp /> : <ChevronDown />}

                <Text weight="bold" size="lg">
                  STARRED PROJECTS
                </Text>
              </Group>
              <Link href={`/users/${id}/starred`} passHref>
                <Text
                  component="a"
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
              </Link>
            </Box>

            <Transition
              mounted={starredOpen}
              transition="scale-y"
              duration={100}
              timingFunction="ease"
            >
              {(styles) => (
                <>
                  {(starredOpen && starredStatus === "loading") || !starred ? (
                    <Skeleton height={128} width="100%" style={{ ...styles }} />
                  ) : (
                    <ProjectList projects={starred} styles={styles} />
                  )}
                </>
              )}
            </Transition>
          </Stack>
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default UserProjectsOverview;

import { Box, Button, Group, Skeleton, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ProjectList from "../components/user/ProjectList";
import { getUserProjects, ProjectResponse } from "../lib/queries/projects";
import useAuthStore from "../store/auth";

const Home = () => {
  const { user } = useAuthStore();

  const router = useRouter();

  const { data, status } = useQuery<ProjectResponse, Error>(
    "projects",
    () => getUserProjects(String(user?.id)),
    {
      enabled: user !== null,
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const projects = data?.projects;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Group sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Title>Your projects</Title>
          <Link href="/new-project" passHref>
            <Button
              component="a"
              color="teal"
              radius="md"
              sx={{ margin: "1rem 0", maxWidth: "25%" }}
            >
              New project
            </Button>
          </Link>
        </Group>
        {status === "loading" || !projects ? (
          <Skeleton sx={{ width: "100%" }} height={256} />
        ) : (
          <ProjectList projects={projects} />
        )}
      </Box>
    </Box>
  );
};

export default Home;

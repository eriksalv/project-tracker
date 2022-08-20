import { Box, Skeleton, Text, Title } from "@mantine/core";
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
        <Title sx={{ width: "100%" }}>Your projects</Title>
        <Text sx={{ marginBottom: "1rem" }} color="dimmed">
          Projects owned by you
        </Text>
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

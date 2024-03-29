import { Box, Skeleton, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ProjectList from "../../../components/user/ProjectList";
import {
  getUserProjects,
  ProjectResponse,
} from "../../../lib/queries/projects";

const UserProjects = () => {
  const router = useRouter();

  const id = router.query.id;

  const { data, status } = useQuery<ProjectResponse, Error>(
    "projects",
    () => getUserProjects(id),
    {
      enabled: id !== undefined,
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
        <Title sx={{ width: "100%" }}>Projects</Title>
        <Text sx={{ marginBottom: "1rem" }} color="dimmed">
          Projects created by the user
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

export default UserProjects;

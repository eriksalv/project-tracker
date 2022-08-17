import { Box, Paper, Text } from "@mantine/core";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQueryClient } from "react-query";
import useProjectStore from "../../store/project";
import { Project } from "../../types/client";

type Props = {
  projects: Project[];
};

const ProjectList: React.FC<Props> = ({ projects }) => {
  const router = useRouter();

  const { setProject } = useProjectStore();

  return (
    <Paper shadow="sm" radius="md" sx={{ width: "100%" }}>
      {projects.length > 0 ? (
        projects.map((project: Project) => (
          <Box
            key={project.id}
            sx={(theme) => ({
              width: "100%",
              borderBottom:
                theme.colorScheme === "dark"
                  ? `1px solid ${theme.colors.dark[6]}`
                  : `1px solid ${theme.colors.gray[3]}`,
              padding: "1rem",
              "&:last-child": { border: 0 },
            })}
          >
            <Text
              weight="bold"
              size="sm"
              onClick={() => {
                setProject(null);
                router.push(`/projects/${project.id}`);
              }}
              sx={{
                "&:hover": { textDecoration: "underline", cursor: "pointer" },
              }}
            >
              {project.title}
            </Text>
            <Text color="dimmed" size="sm">
              Created {moment(project.createdAt).fromNow()} by{" "}
              <Link href={`/users/${project.ownerId}`}>
                {project.owner.username}
              </Link>
            </Text>
          </Box>
        ))
      ) : (
        <Text
          size="lg"
          weight="bold"
          sx={{ textAlign: "center", padding: "4rem" }}
        >
          Nothing here yet
        </Text>
      )}
    </Paper>
  );
};

export default ProjectList;

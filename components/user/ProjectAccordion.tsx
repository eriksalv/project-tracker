import { Box, Group, Skeleton, Stack, Text, Transition } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import { ProjectResponse } from "../../lib/queries/projects";
import ProjectList from "./ProjectList";

type Props = {
  queryKey: string;
  initialOpen?: true;
  fetcher: (
    userId: string | string[] | undefined,
    limit?: number
  ) => Promise<ProjectResponse>;
  title: string;
};

const ProjectAccordion: React.FC<Props> = ({
  queryKey,
  initialOpen,
  fetcher,
  title,
}) => {
  const router = useRouter();

  const { id } = router.query;

  const [open, setOpen] = useState<boolean>(initialOpen ?? false);

  const { data, status } = useQuery<ProjectResponse, Error>(
    queryKey,
    () => fetcher(id, 3),
    {
      enabled: id !== undefined,
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const projects = data?.projects;

  return (
    <Stack sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Group
          onClick={() => setOpen(!open)}
          sx={{
            "&:hover": {
              cursor: "pointer",
              textDecoration: "underline",
            },
          }}
        >
          {open ? <ChevronUp /> : <ChevronDown />}

          <Text weight="bold" size="lg">
            {title}
          </Text>
        </Group>
        <Link href={`/users/${id}/${queryKey}`} passHref>
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
        mounted={open}
        transition="scale-y"
        duration={100}
        timingFunction="ease"
      >
        {(styles) => (
          <>
            {status === "loading" || !projects ? (
              <Skeleton height={128} width="100%" style={{ ...styles }} />
            ) : (
              <ProjectList projects={projects} styles={styles} />
            )}
          </>
        )}
      </Transition>
    </Stack>
  );
};

export default ProjectAccordion;

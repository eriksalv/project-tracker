import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getProject, ProjectResponse } from "../../../lib/queries/projects";
import useProjectStore from "../../../store/project";

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
    }
  );

  if (status === "loading" || (!data?.project && status === "idle")) {
    return <Loader />;
  }

  if (status === "error") {
    return <h1>Error</h1>;
  }

  if (status === "success") {
    const { project } = data;

    return (
      <div>
        <h1>{project?.title}</h1>
        <h1>{project?.description}</h1>
      </div>
    );
  }

  return <></>;
};

export default Project;

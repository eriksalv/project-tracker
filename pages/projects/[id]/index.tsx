import { Box } from "@mantine/core";
import { useRouter } from "next/router";
import IssueList from "../../../components/project/IssueList";
import ProjectHeader from "../../../components/project/ProjectHeader";

const Project = () => {
  const router = useRouter();

  const id = router.query.id;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <ProjectHeader />

      <IssueList id={id} />
    </Box>
  );
};

export default Project;

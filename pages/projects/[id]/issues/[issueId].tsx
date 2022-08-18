import { Box } from "@mantine/core";
import IssueDetails from "../../../../components/issue/IssueDetails";
import ProjectHeader from "../../../../components/project/ProjectHeader";

const Issue = () => {
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
      <IssueDetails />
    </Box>
  );
};

export default Issue;

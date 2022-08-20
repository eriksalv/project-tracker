import { Box, Divider, MediaQuery } from "@mantine/core";
import {
  getStarredProjects,
  getUserContributions,
  getUserProjects,
} from "../../lib/queries/projects";
import ProjectAccordion from "./ProjectAccordion";

const UserProjectsOverview = () => {
  return (
    <Box sx={{ flex: 2 }}>
      <MediaQuery
        largerThan="sm"
        styles={{ paddingLeft: "2rem", marginTop: "100px" }}
      >
        <Box sx={{ width: "100%", paddingTop: "1rem" }}>
          {/* Projects owned */}
          <ProjectAccordion
            fetcher={getUserProjects}
            queryKey="projects"
            title="PROJECTS"
            initialOpen
          />

          <Divider sx={{ margin: "1rem 0" }} />

          {/* Contributing to */}
          <ProjectAccordion
            fetcher={getUserContributions}
            queryKey="contributions"
            title="CONTRIBUTIONS"
          />

          <Divider sx={{ margin: "1rem 0" }} />

          {/* Starred projects */}
          <ProjectAccordion
            fetcher={getStarredProjects}
            queryKey="starred"
            title="STARRED"
          />
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default UserProjectsOverview;

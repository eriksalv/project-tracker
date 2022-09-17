import React from "react";
import { Navbar as MantineNavbar, Skeleton, Text } from "@mantine/core";
import MainLink from "./MainLink";
import { ListDetails, Settings, Users } from "tabler-icons-react";
import useProjectStore from "../../../store/project";

interface Props {
  opened: boolean;
}

const Navbar: React.FC<Props> = ({ opened }) => {
  const { project } = useProjectStore();

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      {project ? (
        <>
          <MantineNavbar.Section>
            <Text>{project.title}</Text>
          </MantineNavbar.Section>
          <MantineNavbar.Section grow mt="lg">
            <MainLink
              route={`/projects/${project.id}`}
              label="Issue board"
              color="green"
              icon={<ListDetails />}
            />
            <MainLink
              route={`/projects/${project.id}/settings`}
              label="Settings"
              color="blue"
              icon={<Settings />}
            />
            <MainLink
              route={`/projects/${project.id}/contributors`}
              label="Contributors"
              color="grape"
              icon={<Users />}
            />
          </MantineNavbar.Section>
        </>
      ) : (
        <Skeleton height="100%" width="100%" />
      )}
    </MantineNavbar>
  );
};

export default Navbar;

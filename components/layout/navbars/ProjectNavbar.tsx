import React from "react";
import { Navbar as MantineNavbar, Text } from "@mantine/core";
import MainLink from "./MainLink";
import { ListDetails, Settings } from "tabler-icons-react";
import useProjectStore from "../../../store/project";

interface Props {
  opened: boolean;
}

const Navbar: React.FC<Props> = ({ opened }) => {
  const { project } = useProjectStore();

  if (!project) {
    return <></>;
  }

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
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
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;

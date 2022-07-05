import React from "react";
import { Navbar as MantineNavbar, Text } from "@mantine/core";

interface Props {
  opened: boolean;
}

const Navbar: React.FC<Props> = ({ opened }) => {
  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <MantineNavbar.Section>
        <Text>Title</Text>
      </MantineNavbar.Section>
      <MantineNavbar.Section grow mt="lg">
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
        <Text>4</Text>
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <Text>Title</Text>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;

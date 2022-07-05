import React, { useState } from "react";
import { AppShell, Footer, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";

const ApplicationContainer: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<Navbar opened={opened} />}
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={<Header theme={theme} opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
};

export default ApplicationContainer;

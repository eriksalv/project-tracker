import React, { useState } from "react";
import Link from "next/link";
import {
  AppShell,
  Footer,
  Group,
  Header,
  Text,
  MediaQuery,
  useMantineTheme,
  Navbar,
  Burger,
  Button,
  Title,
} from "@mantine/core";
import ToggleLightDarkButton from "./ToggleLightDarkButton";

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
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section>
            <Text>Title</Text>
          </Navbar.Section>
          <Navbar.Section grow mt="lg">
            <Text>1</Text>
            <Text>2</Text>
            <Text>3</Text>
            <Text>4</Text>
          </Navbar.Section>
          <Navbar.Section>
            <Text>Title</Text>
          </Navbar.Section>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Link href="/" passHref>
              <Title order={2} style={{ cursor: "pointer" }}>
                Project Tracker
              </Title>
            </Link>

            <Group>
              <Link href="/login" passHref>
                <Button component="a" variant="outline">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button component="a">Sign up</Button>
              </Link>

              <ToggleLightDarkButton />
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default ApplicationContainer;

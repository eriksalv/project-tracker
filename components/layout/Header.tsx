import React from "react";
import {
  Burger,
  Button,
  Group,
  Header as MantineHeader,
  MantineTheme,
  MediaQuery,
  Title,
} from "@mantine/core";
import Link from "next/link";
import ToggleLightDarkButton from "./ToggleLightDarkButton";
import ProfileMenu from "./ProfileMenu";
import useAuthStore from "../../store/auth";

interface Props {
  theme: MantineTheme;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<Props> = ({ theme, opened, setOpened }) => {
  const { user } = useAuthStore();

  return (
    <MantineHeader height={70} p="md">
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

        <Link href={user ? "/home" : "/"} passHref>
          <Title order={2} style={{ cursor: "pointer" }}>
            Project Tracker
          </Title>
        </Link>

        <Group>
          {user ? (
            <ProfileMenu username={user.username} id={user.id} />
          ) : (
            <Group>
              <Link href="/login" passHref>
                <Button component="a" variant="outline">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button component="a">Sign up</Button>
              </Link>
            </Group>
          )}

          <ToggleLightDarkButton />
        </Group>
      </div>
    </MantineHeader>
  );
};

export default Header;

import { Avatar, Divider, Menu, MenuLabel } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";

const ProfileMenu = () => {
  return (
    <Menu
      withArrow
      transition="rotate-right"
      transitionDuration={100}
      transitionTimingFunction="ease"
      control={
        <Avatar sx={{ cursor: "pointer" }} radius="xl" size="md" color="blue" />
      }
    >
      <MenuLabel>Signed in as profile</MenuLabel>
      <Menu.Item component={NextLink} href="/profile">
        Your profile
      </Menu.Item>

      <Divider />

      <Menu.Item component={NextLink} href="/">
        Sign out
      </Menu.Item>
    </Menu>
  );
};

export default ProfileMenu;

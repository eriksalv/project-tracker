import { Avatar, Divider, Menu, MenuLabel } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { showLoader, showInfo } from "../../lib/notifications";
import { signout } from "../../lib/queries/auth";
import useAuthStore from "../../store/auth";

const ProfileMenu: React.FC<{ id: number; username: string }> = ({
  id,
  username,
}) => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const { mutate } = useMutation(signout, {
    onSuccess: () => {
      updateNotification(
        showInfo("You are now signed out", "signout", "Signed out")
      );
      router.push("/");
    },
  });

  const onSignOut = () => {
    showNotification(showLoader("signout", "Signing out..."));
    logout();
    mutate();
  };

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
      <MenuLabel>Signed in as {username}</MenuLabel>
      <Menu.Item component={NextLink} href={`/users/${id}`}>
        Your profile
      </Menu.Item>

      <Divider />

      <Menu.Item component={NextLink} href="/settings/profile">
        Settings
      </Menu.Item>

      <Divider />

      <Menu.Item onClick={onSignOut}>Sign out</Menu.Item>
    </Menu>
  );
};

export default ProfileMenu;

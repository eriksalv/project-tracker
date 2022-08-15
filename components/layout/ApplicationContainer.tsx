import React, { useEffect, useState } from "react";
import {
  AppShell,
  Box,
  Footer,
  Progress,
  useMantineTheme,
} from "@mantine/core";
import Header from "./Header";
import Navbar from "./navbars/ProjectNavbar";
import useAuthStore from "../../store/auth";
import axios from "axios";
import { useMutation } from "react-query";
import ProgressBar from "../progress/ProgressBar";
import { useRouter } from "next/router";
import useProgressStore from "../../store/progress";

const ApplicationContainer: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { signin, logout } = useAuthStore();

  const { mutate } = useMutation(
    async () => {
      const res = await axios.post("/api/auth/signin", {});
      return res.data;
    },
    {
      onSuccess: (data) => {
        signin(data);
      },
      onError: () => {
        logout();
      },
    }
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  const { isAnimating, setIsAnimating } = useProgressStore();
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsAnimating(true);
    const handleStop = () => setIsAnimating(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setIsAnimating]);

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
      navbar={
        router.asPath.match(/\/projects\/.+/) ? (
          <Navbar opened={opened} />
        ) : (
          <></>
        )
      }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
      header={<Header theme={theme} opened={opened} setOpened={setOpened} />}
    >
      <ProgressBar isAnimating={isAnimating} />
      {children}
    </AppShell>
  );
};

export default ApplicationContainer;

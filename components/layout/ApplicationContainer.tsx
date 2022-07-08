import React, { useEffect, useState } from "react";
import { AppShell, Footer, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";
import useAuthStore from "../../store/auth";
import axios from "axios";
import { useMutation } from "react-query";

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

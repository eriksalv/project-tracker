import React, { useEffect, useState } from "react";
import { AppShell, Footer, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";
import useAuthStore from "../../store/auth";
import axios from "axios";
import { useQuery } from "react-query";

const ApplicationContainer: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [token, setToken] = useState<null | string>(null);

  const { signin, logout } = useAuthStore();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useQuery(
    ["signin", token],
    async () => {
      const res = await axios.post(
        "/api/auth/signin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    {
      enabled: !!token,
      onSuccess: (data) => {
        signin(data);
      },
      onError: () => {
        setToken(null);
        logout();
      },
    }
  );

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

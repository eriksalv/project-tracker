import React, { useEffect, useState } from "react";
import { AppShell, Footer, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";
import useAuthStore from "../../store/auth";
import axios from "axios";

const ApplicationContainer: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { signin } = useAuthStore();

  useEffect(() => {
    const fetchUser = async (token: string) => {
      console.log(token);

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
    };

    const token = localStorage.getItem("token");

    if (token) {
      const tokenString = JSON.parse(token);

      fetchUser(tokenString)
        .then((data) => signin(data))
        .catch(console.error);
    }
  }, [signin]);

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

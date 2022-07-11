import React from "react";
import { Text, ThemeIcon, UnstyledButton, Group } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  route: string;
}

function MainLink({ icon, color, label, route }: MainLinkProps) {
  const router = useRouter();

  return (
    <Link href={route} passHref>
      <UnstyledButton
        component="a"
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          marginBottom: "0.3rem",
          borderRadius: theme.radius.sm,
          backgroundColor:
            route === router.asPath
              ? theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[3]
              : "transparent",

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[3],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

export default MainLink;

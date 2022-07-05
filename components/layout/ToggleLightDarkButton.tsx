import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { MoonStars, Sun } from "tabler-icons-react";

const ToggleLightDarkButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <Sun size={18} /> : <MoonStars size={18} />}
    </ActionIcon>
  );
};

export default ToggleLightDarkButton;

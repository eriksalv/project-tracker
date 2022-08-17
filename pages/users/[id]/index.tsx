import { Box, MediaQuery } from "@mantine/core";
import UserDetails from "../../../components/user/UserDetails";
import UserProjectsOverview from "../../../components/user/UserProjectsOverview";

const User = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(90deg, #74EBD5 1%, #9FACE6 55%);",
          height: "168px",
        }}
      ></Box>
      <MediaQuery smallerThan="sm" styles={{ display: "block" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "960px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UserDetails />
          <UserProjectsOverview />
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default User;

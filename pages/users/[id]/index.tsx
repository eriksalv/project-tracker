import { Box, MediaQuery } from "@mantine/core";
import UserDetails from "../../../components/user/UserDetails";

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
          <Box sx={{ flex: 2 }}>Hello world</Box>
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default User;

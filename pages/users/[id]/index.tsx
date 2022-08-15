import { Box } from "@mantine/core";
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
      <Box
        sx={{
          flex: 1,
          maxWidth: "960px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UserDetails />
        <Box sx={{ flex: 2, background: "blue" }}>Hello world</Box>
      </Box>
    </Box>
  );
};

export default User;

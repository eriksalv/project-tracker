import { Box, Title } from "@mantine/core";

const Comments = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title order={3}>Comments</Title>
    </Box>
  );
};

export default Comments;

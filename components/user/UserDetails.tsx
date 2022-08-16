import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getUser, UserResponse } from "../../lib/queries/users";
import useAuthStore from "../../store/auth";
import { Mail } from "tabler-icons-react";

const UserDetails = () => {
  const router = useRouter();

  const { user: authUser } = useAuthStore();

  const id = router.query.id;

  const { data, status } = useQuery<UserResponse, Error>(
    ["user", id],
    () => getUser(+id! as number),
    {
      enabled: id !== undefined,
      onError: () => {
        router.replace("/404");
      },
    }
  );

  const user = data?.user;

  const isLoading = status === "loading" || !user;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Skeleton height={96} circle mb="xl" />
        <Skeleton height={12} mt={20} width="70%" radius="xl" />
        <Skeleton height={12} mt={6} width="70%" radius="xl" />
        <Skeleton height={32} mt={20} radius="md" />
        <Skeleton height={128} mt={20} radius="md" />
      </Box>
    );
  }

  return (
    <Stack spacing="lg" sx={{ alignItems: "center", flex: 1 }}>
      <Avatar size={128} radius="xl" />
      <Text size="xl" weight="bold">
        {user.name ? user.name : user.username}
      </Text>
      {user.name && <Text>{user.username}</Text>}
      {authUser?.id === user.id && (
        <Link href="/settings/profile" passHref>
          <Button component="a" variant="default" sx={{ width: "100%" }}>
            Edit profile
          </Button>
        </Link>
      )}

      {/* About section */}
      <Card shadow="sm" p="md" radius="md" withBorder sx={{ width: "100%" }}>
        <Text size="sm" weight="bold" sx={{ marginBottom: "0.5rem" }}>
          CONTACT
        </Text>
        <Divider />
        <Text
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "0.5rem",

            "&:hover": {
              cursor: "pointer",
              textDecoration: "underline",
            },
          }}
          size="sm"
          weight={100}
          onClick={() => window.open(`mailto:${user.email}`)}
        >
          <Mail size={16} />
          <span>{user.email}</span>
        </Text>
      </Card>
    </Stack>
  );
};

export default UserDetails;

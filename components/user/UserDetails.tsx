import { Avatar, Button, Skeleton, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getUser, UserResponse } from "../../lib/queries/users";
import useAuthStore from "../../store/auth";

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

  return (
    <Skeleton visible={isLoading} height="32rem" sx={{ flex: 1 }}>
      {user && (
        <>
          <Stack spacing="lg">
            <Avatar size={80} radius="xl" />
            <Text size="xl" weight="bold">
              {user.name ? user.name : user.username}
            </Text>
            {user.name && <Text>{user.username}</Text>}
            {authUser?.id === user.id && (
              <Link href="/settings/profile" passHref>
                <Button component="a" variant="default">
                  Edit profile
                </Button>
              </Link>
            )}
          </Stack>
        </>
      )}
    </Skeleton>
  );
};

export default UserDetails;

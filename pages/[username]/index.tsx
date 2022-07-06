import React from "react";
import { useQuery } from "react-query";
import { getUser, UserResponse } from "../../lib/queries/users";
import { useRouter } from "next/router";
import useUsersStore from "../../store/users";

const Profile = () => {
  const router = useRouter();

  const { user, setUser } = useUsersStore();

  const username =
    typeof router.query?.username === "string" ? router.query.username : "";

  const { status } = useQuery<UserResponse, Error>(
    ["profile", username],
    () => getUser(username),
    {
      enabled: username.length > 0,
      onSuccess: (data) => {
        setUser(data.user!);
      },
      onError: () => {
        setUser(null);
      },
    }
  );

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (status === "error") {
    return <h1>Error</h1>;
  }

  if (status === "success" && user) {
    return (
      <div>
        <h1>{user.username}</h1>
        <h1>{user.email}</h1>
        <h1>{user.name}</h1>
      </div>
    );
  }

  return <></>;
};

// export const getServerSideProps = async () => {};

export default Profile;

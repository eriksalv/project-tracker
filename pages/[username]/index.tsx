import React from "react";
import { useQuery } from "react-query";
import { getUser, UserResponse } from "../../lib/queries/users";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();

  const username =
    typeof router.query?.username === "string" ? router.query.username : "";

  const { data, status } = useQuery<UserResponse, Error>(
    ["profile", username],
    () => getUser(username),
    {
      enabled: username.length > 0,
    }
  );

  if (status === "loading" || !data?.user) {
    return <h1>Loading...</h1>;
  }

  if (status === "error") {
    return <h1>Error</h1>;
  }

  if (status === "success") {
    const { user } = data;
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

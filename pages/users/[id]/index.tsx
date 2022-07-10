import React from "react";
import { useQuery } from "react-query";
import { getUser, UserResponse } from "../../../lib/queries/users";
import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();

  const id = router.query.id;

  const { data, status } = useQuery<UserResponse, Error>(
    ["profile", id],
    () => getUser(+id! as number),
    {
      enabled: id !== undefined,
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

export default User;

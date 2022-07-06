import React from "react";
import useAuthStore from "../../store/auth";

const Profile = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h1>{user?.email}</h1>
      <h1>{user?.username}</h1>
      <h1>{user?.name}</h1>
    </div>
  );
};

export default Profile;

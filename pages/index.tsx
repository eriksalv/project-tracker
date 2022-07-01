import { User } from "@prisma/client";
import type { NextPage } from "next";
import prisma from "../lib/prisma";

interface Props {
  users: User[];
}

const Home: NextPage<Props> = (props) => {
  const { users } = props;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
};

export const getStaticProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: {
      users,
    },
    revalidate: 60,
  };
};

export default Home;

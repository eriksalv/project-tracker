import { User } from "@prisma/client";
import type { NextPage } from "next";
import prisma from "../lib/prisma";

interface Props {
  users: string;
}

const Home: NextPage<Props> = (props) => {
  const { users } = props;
  const parsedUsers = JSON.parse(users) as User[];

  return (
    <ul>
      {parsedUsers.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
};

export const getStaticProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: {
      users: JSON.stringify(users),
    },
    revalidate: 60,
  };
};

export default Home;

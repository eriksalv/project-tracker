import type { NextPage } from "next";
import { AppState, wrapper } from "../app/store";
import prisma from "../lib/prisma";

import { setUsers } from "../app/store/slices/user";
import { useAppSelector } from "../app/store/hooks";

interface Props {
  user:
    | {
        email: string;
        username: string;
        id: number;
      }[]
    | null;
}

const Home: NextPage<Props> = (props) => {
  const { users } = useAppSelector(
    (state: AppState) => state.userReducer.users
  );

  return (
    <ul>
      {users && users.map((user: any) => <li key={user.id}>{user.email}</li>)}
    </ul>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });

    store.dispatch(setUsers({ users }));

    return {
      props: {
        users,
      },
    };
  }
);

export default Home;

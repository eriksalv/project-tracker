import type { NextPage } from "next";
import prisma from "../lib/prisma";
import { dehydrate, QueryClient, useQuery } from "react-query";

const Home: NextPage = () => {
  const { data, status } = useQuery("users", () => [{}], { enabled: false });

  if (status === "loading") {
    return <h1>Loading</h1>;
  }

  if (status === "error") {
    return <h1>Error</h1>;
  }

  return (
    <>
      <h1>Hello world</h1>
      <ul>
        {data?.map((user: any) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("users", async () => {
    return await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default Home;

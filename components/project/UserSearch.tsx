import { Box, Card, Text, TextInput } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "react-query";
import { Search } from "tabler-icons-react";
import { getUsers } from "../../lib/queries/users";
import useProjectStore from "../../store/project";
import { User } from "../../types/client";

type Props = {
  selectContributor: Dispatch<SetStateAction<User | null>>;
};

const UserSearch: React.FC<Props> = ({ selectContributor }) => {
  const [input, setInput] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const { project } = useProjectStore();

  useQuery(
    ["users", { search: input }],
    async () => await getUsers(input!, 6),
    {
      enabled: input != "",
      onSuccess: (data) => {
        if (!data.users) {
          setUsers([]);
        }

        setUsers(
          data.users!.filter(
            (user) =>
              !project?.board.contributors
                .map((c) => c.userId)
                .includes(user.id)
          )
        );
      },
    }
  );

  return (
    <>
      <TextInput
        placeholder="Search by username or email"
        radius="md"
        icon={<Search />}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {input && users.length > 0 && (
        <Card
          shadow="sm"
          radius="md"
          sx={{ width: "100%", marginTop: "0.5rem" }}
        >
          {users &&
            users.map((user) => (
              <Box
                key={user.id}
                sx={(theme) => ({
                  width: "100%",
                  padding: "10px",
                  borderBottom:
                    theme.colorScheme === "dark"
                      ? `1px solid ${theme.colors.dark[6]}`
                      : `1px solid ${theme.colors.gray[3]}`,
                  "&:first-child": {
                    borderRadius: "0.5rem 0.5rem 0 0",
                  },
                  "&:last-child": {
                    border: 0,
                    borderRadius: "0 0 0.5rem 0.5rem",
                  },
                  "&:hover": {
                    cursor: "pointer",
                    background:
                      theme.colorScheme === "dark"
                        ? `${theme.colors.dark[7]}`
                        : `${theme.colors.gray[4]}`,
                  },
                })}
                onClick={() => selectContributor(user)}
              >
                <Text weight="bold" size="sm" sx={{ margin: 0, width: "100%" }}>
                  {user.username}
                </Text>
                <Text color="dimmed" size="sm">
                  {user.email}
                </Text>
              </Box>
            ))}
        </Card>
      )}
    </>
  );
};

export default UserSearch;

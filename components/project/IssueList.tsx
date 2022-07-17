import {
  ActionIcon,
  Badge,
  Button,
  Group,
  List,
  Menu,
  MenuLabel,
  Modal,
  Pagination,
  Paper,
  Skeleton,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { ArrowsSort, Circle, Search } from "tabler-icons-react";
import { getIssues, IssueResponse } from "../../lib/queries/issues";
import Issue from "./Issue";
import IssueForm from "./IssueForm";

type props = {
  id: string | string[] | undefined;
};

const getTotalPages = (count: number) => {
  return Math.ceil(count / 10);
};

const IssueList: React.FC<props> = ({ id }) => {
  const [activePage, setPage] = useState(1);
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState(false);

  const { data, status, isFetching } = useQuery<IssueResponse, Error>(
    ["issues", id, activePage],
    () => getIssues(id, activePage),
    {
      enabled: id !== undefined,
      keepPreviousData: true,
    }
  );

  const issues = data?.issues;

  const count = data?.count;

  const isLoading = status === "loading" || !issues || isFetching;

  const getRows = () =>
    issues?.map((issue) => <Issue issue={issue} key={issue.id} />);

  return (
    <Skeleton
      visible={isLoading}
      width="100%"
      height={isLoading ? "500px" : "auto"}
      sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
    >
      <Modal
        opened={createIssueModalOpen}
        onClose={() => setCreateIssueModalOpen(false)}
        title="New issue"
        overflow="inside"
        size="xl"
      >
        <IssueForm id={id} closeModal={() => setCreateIssueModalOpen(false)} />
      </Modal>

      <Group
        sx={{
          marginBottom: "1rem",
          justifyContent: "space-between",
          flexBasis: "100%",
        }}
      >
        <TextInput
          placeholder="Search issues..."
          radius="md"
          icon={<Search />}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              console.log("Searching...");
            }
          }}
          sx={{ flex: 9 }}
        />
        <Button
          sx={{ flex: 1, maxWidth: "8rem" }}
          color="teal"
          onClick={() => setCreateIssueModalOpen(true)}
        >
          New issue
        </Button>
      </Group>

      {issues && (
        <Paper shadow="xl" sx={{ width: "100%" }}>
          <List>
            <Group
              sx={(theme) => ({
                borderBottom:
                  theme.colorScheme === "dark"
                    ? `1px solid ${theme.colors.dark[6]}`
                    : `1px solid ${theme.colors.gray[3]}`,
                padding: "1rem",
                width: "100%",
                justifyContent: "space-between",
              })}
            >
              <Group>
                <ThemeIcon color="gray" size={24} radius="xl">
                  <Circle size={16} />
                </ThemeIcon>

                <Text size="md">{`Total issues: ${count}`}</Text>
              </Group>

              <Group>
                <Menu
                  withArrow
                  transition="rotate-right"
                  transitionDuration={100}
                  transitionTimingFunction="ease"
                  control={
                    <ActionIcon>
                      <ArrowsSort />
                    </ActionIcon>
                  }
                >
                  <MenuLabel>Sort by</MenuLabel>
                  <Menu.Item>Newest</Menu.Item>
                  <Menu.Item>Oldest</Menu.Item>
                  <Menu.Item>Recently Updated</Menu.Item>
                  <Menu.Item>Least recently updated</Menu.Item>
                  <Menu.Item>Most commented</Menu.Item>
                  <Menu.Item>Least commented</Menu.Item>
                </Menu>
              </Group>
            </Group>

            {getRows()}
          </List>
        </Paper>
      )}
      <Pagination
        page={activePage}
        onChange={setPage}
        total={getTotalPages(count!)}
        sx={{ marginTop: "1rem" }}
      />
    </Skeleton>
  );
};

export default IssueList;

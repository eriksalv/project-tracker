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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ArrowsSort, Circle, Search } from "tabler-icons-react";
import { getIssues, IssueResponse } from "../../lib/queries/issues";
import useAuthStore from "../../store/auth";
import useProjectStore from "../../store/project";
import Issue from "./Issue";
import IssueForm from "./IssueForm";

type props = {
  id: string | string[] | undefined;
};

const getTotalPages = (count: number) => {
  return Math.ceil(count / 10);
};

const IssueList: React.FC<props> = ({ id }) => {
  // const [activePage, setPage] = useState(1);
  const { user } = useAuthStore();
  const router = useRouter();
  const { project } = useProjectStore();

  const page = router.query.page ?? 1;

  const search = router.query.search ?? "";

  const orderBy = router.query.orderBy ?? "";

  const [createIssueModalOpen, setCreateIssueModalOpen] = useState(false);
  const [input, setInput] = useState<string | string[]>("");

  useEffect(() => {
    setInput(search);
  }, [search]);

  const { data, status, isFetching } = useQuery<IssueResponse, Error>(
    ["issues", id, { page, orderBy, search }],
    () => getIssues(id, String(page), search, orderBy),
    {
      enabled: id !== undefined,
    }
  );

  const issues = data?.issues;

  const count = data?.count;

  const isLoading = status === "loading" || !issues || isFetching;

  const getRows = () =>
    issues?.map((issue) => (
      <Issue issue={issue} projectId={+id!} key={issue.id} />
    ));

  return (
    <Skeleton
      visible={isLoading}
      width="100%"
      height={isLoading ? "500px" : "auto"}
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        maxWidth: "1280px",
      }}
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              router.push(
                `/projects/${id}?search=${input}&orderBy=${orderBy}&page=1`
              );
            }
          }}
          sx={{ flex: 9 }}
        />
        {/* Show "create-issue" button if user is a contributor */}
        {user &&
          project?.board.contributors
            .map((c) => c.user.id)
            .includes(user.id) && (
            <Button
              sx={{ flex: 1, maxWidth: "8rem" }}
              color="teal"
              onClick={() => setCreateIssueModalOpen(true)}
            >
              New issue
            </Button>
          )}
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
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=createdAt-desc&page=${page}`
                      );
                    }}
                  >
                    Newest
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=createdAt-asc&page=${page}`
                      );
                    }}
                  >
                    Oldest
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=updatedAt-desc&page=${page}`
                      );
                    }}
                  >
                    Recently Updated
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=updatedAt-asc&page=${page}`
                      );
                    }}
                  >
                    Least recently updated
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=comments-desc&page=${page}`
                      );
                    }}
                  >
                    Most commented
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push(
                        `/projects/${id}?search=${input}&orderBy=comments-asc&page=${page}`
                      );
                    }}
                  >
                    Least commented
                  </Menu.Item>
                </Menu>
              </Group>
            </Group>

            {issues.length > 0 ? (
              getRows()
            ) : (
              <Text
                size="lg"
                weight="bold"
                sx={{ textAlign: "center", padding: "8rem" }}
              >
                No issues found
              </Text>
            )}
          </List>
        </Paper>
      )}
      {issues?.length! > 0 && (
        <Pagination
          page={+page}
          onChange={(page) =>
            router.push(
              `/projects/${id}?search=${search}&orderBy=${orderBy}&page=${page}`
            )
          }
          total={getTotalPages(count!)}
          sx={{ marginTop: "1rem" }}
        />
      )}
    </Skeleton>
  );
};

export default IssueList;

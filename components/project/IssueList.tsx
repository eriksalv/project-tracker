import { List, Pagination, Paper, Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getIssues, IssueResponse } from "../../lib/queries/issues";
import Issue from "./Issue";

type props = {
  id: string | string[] | undefined;
};

const getTotalPages = (count: number) => {
  return Math.ceil(count / 10);
};

const IssueList: React.FC<props> = ({ id }) => {
  const [activePage, setPage] = useState(1);

  const { data, status, isFetching } = useQuery<IssueResponse, Error>(
    ["issues", activePage],
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
      {issues && (
        <Paper shadow="xl" sx={{ width: "100%" }}>
          <List>{getRows()}</List>
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

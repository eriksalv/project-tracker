import { Box, Button, Group, Paper, Stack, Text } from "@mantine/core";
import moment from "moment";
import { useRouter } from "next/router";
import React, { CSSProperties, Dispatch, SetStateAction } from "react";
import useAuthStore from "../../store/auth";
import useProjectStore from "../../store/project";
import { Contributor, User } from "../../types/client";

type Props = {
  contributors: Contributor[];
  styles?: CSSProperties;
  selectContributor: Dispatch<SetStateAction<User | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
};

const ContributorList: React.FC<Props> = ({
  contributors,
  styles,
  selectContributor,
  openModal,
}) => {
  const router = useRouter();

  const { user } = useAuthStore();
  const { project } = useProjectStore();

  return (
    <Paper shadow="sm" radius="md" sx={{ width: "100%" }} style={{ ...styles }}>
      {contributors.length > 0 ? (
        contributors.map((contributor: Contributor) => (
          <Box
            key={contributor.userId}
            sx={(theme) => ({
              width: "100%",
              borderBottom:
                theme.colorScheme === "dark"
                  ? `1px solid ${theme.colors.dark[6]}`
                  : `1px solid ${theme.colors.gray[3]}`,
              padding: "1rem",
              "&:last-child": { border: 0 },
            })}
          >
            <Group sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.3}>
                <Text
                  weight="bold"
                  size="sm"
                  onClick={() => {
                    router.push(`/users/${contributor.userId}`);
                  }}
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  {contributor.user.username}
                  {contributor.userId == project?.ownerId && (
                    <span style={{ color: "green" }}> (owner)</span>
                  )}
                </Text>
                <Text color="dimmed" size="sm">
                  Joined {moment(contributor.createdAt).fromNow()}
                </Text>
              </Stack>
              {user?.id == project?.owner.id &&
                contributor.userId != project?.owner.id && (
                  <Button
                    variant="outline"
                    color="red"
                    radius="lg"
                    onClick={() => {
                      selectContributor(contributor.user);
                      openModal(true);
                    }}
                  >
                    Remove
                  </Button>
                )}
            </Group>
          </Box>
        ))
      ) : (
        <Text
          size="lg"
          weight="bold"
          sx={{ textAlign: "center", padding: "4rem" }}
        >
          Nothing here yet
        </Text>
      )}
    </Paper>
  );
};

export default ContributorList;

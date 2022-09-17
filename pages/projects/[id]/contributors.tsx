import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Skeleton,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Check, X } from "tabler-icons-react";
import ContributorList from "../../../components/project/ContributorList";
import ProjectHeader from "../../../components/project/ProjectHeader";
import UserSearch from "../../../components/project/UserSearch";
import { showError, showSuccess } from "../../../lib/notifications";
import {
  addContributor,
  removeContributor,
} from "../../../lib/queries/constributors";
import useAuthStore from "../../../store/auth";
import useProjectStore from "../../../store/project";
import { User } from "../../../types/client";

const Contributors = () => {
  const [addOpened, setAddOpened] = useState(false);
  const [removeOpened, setRemoveOpened] = useState(false);
  const [contributorToAdd, setContributorToAdd] = useState<null | User>(null);
  const [contributorToRemove, setContributorToRemove] = useState<null | User>(
    null
  );

  const router = useRouter();
  const id = router.query.id;
  const queryClient = useQueryClient();

  const { project } = useProjectStore();
  const { user } = useAuthStore();

  const addContributorMutation = useMutation(
    async (userId: number) => await addContributor(id, userId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["projects", id]);
        showNotification({
          ...showSuccess("Contributor added successfully", "add-contributor"),
          icon: <Check size={16} />,
        });

        setAddOpened(false);
        setContributorToAdd(null);
      },
      onError: (error) => {
        showNotification(showError(error, "add-constributor"));
      },
    }
  );

  const removeContributorMutation = useMutation(
    async (contributorId: number) => await removeContributor(id, contributorId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["projects", id]);
        showNotification({
          ...showSuccess(
            `${contributorToRemove?.username} is no longer a contributor`,
            "remove-contributor"
          ),
          icon: <Check size={16} />,
        });

        setRemoveOpened(false);
        setContributorToRemove(null);
      },
      onError: (error) => {
        showNotification(showError(error, "remove-contributor"));
      },
    }
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <ProjectHeader />

      {project ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: "960px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Modal
            opened={addOpened}
            onClose={() => {
              setContributorToAdd(null);
              setAddOpened(false);
            }}
            size="lg"
          >
            <Title order={3} sx={{ marginBottom: "1rem", textAlign: "center" }}>
              Invite a contributor to <b>{project.title}</b>
            </Title>

            {contributorToAdd ? (
              <Card
                shadow="sm"
                radius="md"
                withBorder
                sx={{ width: "100%", marginTop: "0.5rem" }}
              >
                <Group
                  sx={(theme) => ({
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px",
                  })}
                >
                  <Box>
                    <Text
                      weight="bold"
                      size="sm"
                      sx={{ margin: 0, width: "100%" }}
                    >
                      {contributorToAdd.username}
                    </Text>
                    <Text color="dimmed" size="sm">
                      {contributorToAdd.email}
                    </Text>
                  </Box>

                  <ActionIcon
                    variant="transparent"
                    onClick={() => setContributorToAdd(null)}
                  >
                    <X size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            ) : (
              <UserSearch selectContributor={setContributorToAdd} />
            )}

            <Button
              fullWidth
              color="teal"
              sx={{ marginTop: "2rem" }}
              disabled={contributorToAdd == null}
              loading={addContributorMutation.isLoading}
              styles={(theme) => ({
                root: {
                  "&:hover": {
                    backgroundColor: theme.fn.darken("#006633", 0.05),
                  },
                },
              })}
              onClick={() => {
                if (contributorToAdd == null) {
                  return;
                }
                addContributorMutation.mutate(contributorToAdd.id);
              }}
            >
              {contributorToAdd == null
                ? "Select a user above"
                : `Add ${contributorToAdd.username}`}
            </Button>
          </Modal>

          <Modal
            opened={removeOpened}
            onClose={() => {
              setContributorToRemove(null);
              setRemoveOpened(false);
            }}
            size="lg"
          >
            <Title order={3} sx={{ marginBottom: "1rem", textAlign: "center" }}>
              Confirm you want to remove <b>{contributorToRemove?.username}</b>{" "}
              as contributor
            </Title>

            <Button
              fullWidth
              color="red"
              sx={{ marginTop: "2rem" }}
              disabled={contributorToRemove == null}
              loading={removeContributorMutation.isLoading}
              styles={(theme) => ({
                root: {
                  "&:hover": {
                    backgroundColor: theme.fn.darken("#550000", 0.05),
                  },
                },
              })}
              onClick={() => {
                if (contributorToRemove == null) {
                  return;
                }
                removeContributorMutation.mutate(contributorToRemove.id);
              }}
            >
              Confirm
            </Button>
          </Modal>

          <Group sx={{ justifyContent: "space-between" }}>
            <Text sx={{ fontWeight: "normal", fontSize: "2.2rem" }}>
              Contributors
            </Text>
            {user?.id == project.ownerId && (
              <Button
                color="teal"
                size="sm"
                radius="lg"
                sx={{ maxWidth: "10rem" }}
                onClick={() => setAddOpened(true)}
              >
                Add contributor
              </Button>
            )}
          </Group>
          <Divider sx={{ margin: "1rem 0" }} />
          <ContributorList
            contributors={project.board.contributors}
            openModal={setRemoveOpened}
            selectContributor={setContributorToRemove}
          />
        </Box>
      ) : (
        <Skeleton height="500px" sx={{ maxWidth: "960px" }} />
      )}
    </Box>
  );
};

export default Contributors;

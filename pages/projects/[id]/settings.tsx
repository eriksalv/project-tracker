import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Skeleton,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Check } from "tabler-icons-react";
import ProjectHeader from "../../../components/project/ProjectHeader";
import { showError, showSuccess } from "../../../lib/notifications";
import { deleteProject, updateProject } from "../../../lib/queries/projects";
import {
  UpdateProjectForm,
  updateProjectSchema,
} from "../../../lib/validation/project";
import useAuthStore from "../../../store/auth";
import useProjectStore from "../../../store/project";

const ProjectSettings = () => {
  const [deleteOpened, setDeleteOpened] = useState(false);

  const router = useRouter();
  const id = router.query.id;
  const queryClient = useQueryClient();

  const { project } = useProjectStore();
  const { user } = useAuthStore();

  const formOptions = { resolver: yupResolver(updateProjectSchema) };

  const { register, handleSubmit, formState } =
    useForm<UpdateProjectForm>(formOptions);
  const { errors, isDirty } = formState;

  const updateProjectMutation = useMutation(
    async (data: UpdateProjectForm) => await updateProject(data, id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["projects", id]);
        showNotification({
          ...showSuccess("Project updated successfully", "update-project"),
          icon: <Check size={16} />,
        });
      },
      onError: (error) => {
        showNotification(showError(error, "update-project"));
      },
    }
  );

  const deleteProjectMutation = useMutation(
    async () => await deleteProject(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["projects", id]);
        showNotification({
          ...showSuccess("Project deleted successfully", "delete-project"),
          icon: <Check size={16} />,
        });

        router.push("/home");
      },
      onError: (error) => {
        showNotification(showError(error, "delete-project"));
      },
    }
  );

  const onSubmit = (data: UpdateProjectForm) => {
    updateProjectMutation.mutate(data);
  };

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
            opened={deleteOpened}
            onClose={() => setDeleteOpened(false)}
            size="lg"
          >
            <Title order={3} sx={{ marginBottom: "1rem" }}>
              Are you sure you want to delete this project?
            </Title>
            <Text>
              This action will permanently delete the{" "}
              <b>
                {project.owner.username}/{project.title}
              </b>{" "}
              project, and remove all issues and contributors.
            </Text>

            <Button
              fullWidth
              color="red"
              sx={{ marginTop: "2rem" }}
              loading={deleteProjectMutation.isLoading}
              styles={(theme) => ({
                root: {
                  "&:hover": {
                    backgroundColor: theme.fn.darken("#6B0000", 0.05),
                  },
                },
              })}
              onClick={() => deleteProjectMutation.mutate()}
            >
              Confirm deletion
            </Button>
          </Modal>

          <Text sx={{ fontWeight: "normal", fontSize: "2.2rem" }}>
            General settings
          </Text>
          <Divider sx={{ margin: "1rem 0" }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Title order={4} sx={{ marginBottom: "0.5rem" }}>
              Project name
            </Title>
            <TextInput
              id="title"
              {...register("title")}
              error={errors.title?.message}
              defaultValue={project.title}
              sx={{ maxWidth: "15rem" }}
              disabled={user?.id != project.owner.id}
            />

            <Title order={4} sx={{ margin: "0.5rem 0" }}>
              Description
            </Title>
            <Textarea
              id="description"
              {...register("description")}
              error={errors.description?.message}
              defaultValue={project.description || ""}
              sx={{ maxWidth: "30rem" }}
              autosize
              minRows={2}
              maxRows={4}
              disabled={user?.id != project.owner.id}
            />
            {project.owner.id == user?.id && (
              <Group sx={{ maxWidth: "15rem", margin: "1rem 0" }}>
                <Button
                  fullWidth
                  type="submit"
                  loading={updateProjectMutation.isLoading}
                  disabled={!isDirty}
                  color="gray"
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#333333", 0.05),
                      },
                    },
                  })}
                >
                  Save changes
                </Button>

                <Button
                  fullWidth
                  color="red"
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor: theme.fn.darken("#6B0000", 0.05),
                      },
                    },
                  })}
                  onClick={() => setDeleteOpened(true)}
                >
                  Delete project
                </Button>
              </Group>
            )}
          </form>

          <Text sx={{ fontWeight: "normal", fontSize: "2.2rem" }}>
            Contributors
          </Text>
          <Divider sx={{ margin: "1rem 0" }} />
        </Box>
      ) : (
        <Skeleton height="500px" sx={{ maxWidth: "960px" }} />
      )}
    </Box>
  );
};

export default ProjectSettings;

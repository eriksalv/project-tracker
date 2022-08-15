import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Chip,
  Chips,
  NativeSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Check } from "tabler-icons-react";
import { showError, showSuccess } from "../../lib/notifications";
import { createIssue } from "../../lib/queries/issues";
import { CreateIssueForm, createIssueSchema } from "../../lib/validation/issue";
import useProjectStore from "../../store/project";

type props = {
  id: string | string[] | undefined;
  closeModal: () => void;
};

const IssueForm: React.FC<props> = ({ id, closeModal }) => {
  // const [priority, setPriority] = useState<string>("MEDIUM");

  const [assignee, setAssignee] = useState<number | "">("");

  const { project } = useProjectStore();

  const queryClient = useQueryClient();

  const formOptions = { resolver: yupResolver(createIssueSchema) };

  const { register, handleSubmit, formState, control } =
    useForm<CreateIssueForm>(formOptions);
  const { errors } = formState;

  const createIssueMutation = useMutation(
    async (data: CreateIssueForm) => await createIssue(data, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["issues", id]);
        closeModal();

        showNotification({
          ...showSuccess("Issue created successfully", "create-issue"),
          icon: <Check size={16} />,
        });
      },
      onError: (error) => {
        showNotification(showError(error, "create-issue"));
      },
    }
  );

  const onSubmit = (data: CreateIssueForm) => {
    createIssueMutation.mutate(data);
  };

  if (project) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          id="title"
          label="Title/Summary"
          {...register("title")}
          error={errors.title?.message}
          required
        />

        <Textarea
          id="description"
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />

        {/* <NativeSelect
          id="priority"
          label="Priority"
          placeholder="Pick one"
          value={priority}
          data={[
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
          ]}
          {...register("priority")}
          error={errors.priority?.message}
          onChange={(event) =>
            setPriority(event.currentTarget.value as Priority)
          }
          required
        /> */}

        <Text size="sm" weight={500} sx={{ marginTop: "0.5rem" }}>
          Priority
        </Text>

        <Controller
          control={control}
          name="priority"
          defaultValue="MEDIUM"
          render={({ field: { onChange, onBlur, value } }) => (
            <Chips
              id="priority"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              sx={{ margin: "0.5rem 0" }}
            >
              <Chip value="LOW">Low</Chip>
              <Chip value="MEDIUM">Medium</Chip>
              <Chip value="HIGH">High</Chip>
            </Chips>
          )}
        />

        <Text size="sm" weight={500} sx={{ marginTop: "0.5rem" }}>
          {errors.priority?.message}
        </Text>

        <NativeSelect
          id="assignee"
          label="Assign to"
          placeholder="Unassigned"
          datatype="number"
          value={assignee ? String(assignee) : ""}
          data={[
            ...project.board.contributors.map((c) => ({
              value: String(c.user.id),
              label: c.user.username,
            })),
            { value: "", label: "Unassigned" },
          ]}
          {...register("assigneeId")}
          error={errors.assigneeId?.message}
          onChange={(event) =>
            setAssignee(
              event.currentTarget.value
                ? parseInt(event.currentTarget.value)
                : ""
            )
          }
        />

        <Button
          type="submit"
          loading={createIssueMutation.isLoading}
          fullWidth
          color="cyan"
          styles={(theme) => ({
            root: {
              marginTop: "1rem",
              "&:hover": {
                backgroundColor: theme.fn.darken("#00acee", 0.05),
              },
            },
          })}
        >
          Create issue
        </Button>
      </form>
    );
  }

  return <></>;
};

export default IssueForm;

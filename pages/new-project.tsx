import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Textarea, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createProject } from "../lib/queries/projects";
import {
  CreateProjectForm,
  createProjectSchema,
} from "../lib/validation/project";

const NewProject = () => {
  const [isPublic, setIsPublic] = useState(true);

  const queryClient = useQueryClient();

  const formOptions = { resolver: yupResolver(createProjectSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<CreateProjectForm>(formOptions);
  const { errors } = formState;

  const router = useRouter();

  const registerMutation = useMutation(
    async (data: CreateProjectForm) => await createProject(data),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["projects", data.project?.id], data.project!);
        router.replace(`/projects/${data.project?.id}`);
      },
      onError: () => {
        console.error("Something went wrong");
        reset();
      },
    }
  );

  const onSubmit = (data: CreateProjectForm) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        id="title"
        label="Title"
        {...register("title")}
        error={errors.title?.message}
        required
      />

      <Textarea
        id="description"
        label="Description"
        {...register("description")}
        error={errors.description?.message}
        autosize
        minRows={2}
        maxRows={4}
      />

      <Radio
        sx={{ marginBottom: "1rem", marginTop: "1rem" }}
        value="true"
        label="Public"
        datatype="boolean"
        {...register("public")}
        checked={isPublic}
        onChange={() => setIsPublic(true)}
        required
      />
      <Radio
        sx={{ marginBottom: "1rem", marginTop: "1rem" }}
        value="false"
        label="Private"
        datatype="boolean"
        {...register("public")}
        checked={!isPublic}
        onChange={() => setIsPublic(false)}
        required
      />

      <Button
        type="submit"
        loading={registerMutation.isLoading}
        fullWidth
        color="cyan"
        styles={(theme) => ({
          root: {
            marginTop: 10,
            "&:hover": {
              backgroundColor: theme.fn.darken("#00acee", 0.05),
            },
          },
        })}
      >
        Create Project
      </Button>
    </form>
  );
};

export default NewProject;

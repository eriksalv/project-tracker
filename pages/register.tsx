import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { registerSchema, RegisterForm } from "../lib/validation/signup";
import useAuthStore from "../store/auth";
import { useMutation } from "react-query";
import { signup } from "../lib/queries/auth";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const formOptions = { resolver: yupResolver(registerSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<RegisterForm>(formOptions);
  const { errors } = formState;

  const { signin } = useAuthStore();

  const registerMutation = useMutation(
    async (data: RegisterForm) => await signup(data),
    {
      onSuccess: (data) => {
        signin(data);
        router.replace("/");
      },
      onError: () => {
        console.error("something went wrong");
        reset();
      },
    }
  );

  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          id="email"
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          required
        />

        <TextInput
          id="username"
          label="Username"
          {...register("username")}
          error={errors.username?.message}
          required
        />

        <TextInput
          id="name"
          label="Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <PasswordInput
          id="password"
          {...register("password")}
          label="Password"
          error={errors.password?.message}
          required
        />

        <PasswordInput
          id="confirmPassword"
          {...register("confirmPassword")}
          label="Confirm password"
          error={errors.confirmPassword?.message}
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
          Sign up
        </Button>
      </form>
    </Card>
  );
};

export default RegisterPage;

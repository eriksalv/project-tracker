import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { LoginForm, loginSchema } from "../lib/validation/signin";
import { signin } from "../lib/queries/auth";
import { useMutation } from "react-query";
import useAuthStore from "../store/auth";
import { useRouter } from "next/router";

const LoginPage = () => {
  const formOptions = { resolver: yupResolver(loginSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<LoginForm>(formOptions);
  const { errors } = formState;

  const router = useRouter();

  const { signin: zustandSignin } = useAuthStore();

  const loginMutation = useMutation(
    async (data: LoginForm) => await signin(data),
    {
      onSuccess: (data) => {
        zustandSignin(data);
        router.replace("/");
      },
      onError: () => {
        console.error("Something went wrong");
        reset();
      },
    }
  );

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          id="emailOrUsername"
          label="Email or username"
          {...register("emailOrUsername")}
          error={errors.emailOrUsername?.message}
        />

        <PasswordInput
          id="password"
          label="Password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          loading={loginMutation.isLoading}
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

export default LoginPage;

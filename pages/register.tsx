import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { registerSchema, RegisterForm } from "../lib/validation/signup";
import axios from "axios";

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formOptions = { resolver: yupResolver(registerSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<RegisterForm>(formOptions);
  const { errors } = formState;

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    console.log(JSON.stringify(data, null, 2));

    try {
      const res = await axios.post(`/api/auth/signup`, data);
      console.log(res);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
    setLoading(false);
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
          loading={loading}
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

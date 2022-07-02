import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Card, TextInput } from "@mantine/core";

interface RegisterForm {
  email: string;
  username: string;
  name?: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters")
    .max(20, "Username cannot exceed 20 characters")
    .required("Username is required"),
  name: yup.string(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formOptions = { resolver: yupResolver(registerSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<RegisterForm>(formOptions);
  const { errors } = formState;

  const onSubmit = (data: RegisterForm) => {
    setLoading(true);
    console.log(JSON.stringify(data, null, 2));
    reset();
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

        <TextInput
          id="password"
          type="password"
          {...register("password")}
          label="Password"
          error={errors.password?.message}
          required
        />

        <TextInput
          id="confirmPassword"
          type="password"
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

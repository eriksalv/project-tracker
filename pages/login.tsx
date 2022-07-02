import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Card, TextInput } from "@mantine/core";

interface LoginForm {
  emailOrUsername: string;
  password: string;
}

const loginSchema = yup.object().shape({
  emailOrUsername: yup.string().required("Please enter your email or username"),
  password: yup.string().required("Please enter your password"),
});

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formOptions = { resolver: yupResolver(loginSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<LoginForm>(formOptions);
  const { errors } = formState;

  const onSubmit = (data: LoginForm) => {
    setLoading(true);
    console.log(JSON.stringify(data, null, 2));
    reset();
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

        <TextInput
          id="password"
          type="password"
          label="Password"
          {...register("password")}
          error={errors.password?.message}
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

export default LoginPage;

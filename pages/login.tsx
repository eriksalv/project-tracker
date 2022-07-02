import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface LoginForm {
  emailOrUsername: string;
  password: string;
}

const loginSchema = yup.object().shape({
  emailOrUsername: yup.string().required("Please enter your email or username"),
  password: yup.string().required("Please enter your password"),
});

const LoginPage = () => {
  const formOptions = { resolver: yupResolver(loginSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<LoginForm>(formOptions);
  const { errors } = formState;

  const onSubmit = (data: LoginForm) => {
    console.log(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="emailOrUsername">Email or username</label>
        <input type="text" {...register("emailOrUsername")} />
        <p>{errors.emailOrUsername?.message}</p>

        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        <p>{errors.password?.message}</p>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginPage;

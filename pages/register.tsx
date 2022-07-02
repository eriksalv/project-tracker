import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const formOptions = { resolver: yupResolver(registerSchema) };

  const { register, handleSubmit, reset, formState } =
    useForm<RegisterForm>(formOptions);
  const { errors } = formState;

  const onSubmit = (data: RegisterForm) => {
    console.log(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("email")} placeholder="Email" />
        <p>{errors.email?.message}</p>

        <input type="text" {...register("username")} placeholder="Username" />
        <p>{errors.name?.message}</p>

        <input type="text" {...register("name")} placeholder="Name" />
        <p>{errors.name?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        <p>{errors.password?.message}</p>

        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
        <p>{errors.confirmPassword?.message}</p>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

import * as yup from "yup";

export interface RegisterForm {
  email: string;
  username: string;
  name?: string;
  password: string;
  confirmPassword: string;
}

export const registerSchema: yup.SchemaOf<RegisterForm> = yup.object().shape({
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

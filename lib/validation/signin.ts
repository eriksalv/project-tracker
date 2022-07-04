import * as yup from "yup";

export interface LoginForm {
  emailOrUsername: string;
  password: string;
}

export const loginSchema: yup.SchemaOf<LoginForm> = yup.object().shape({
  emailOrUsername: yup.string().required("Please enter your email or username"),
  password: yup.string().required("Please enter your password"),
});

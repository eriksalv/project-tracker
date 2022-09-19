import * as yup from "yup";

export interface UpdateProfileForm {
  name?: string | null;
  username?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const updateProfileSchema: yup.SchemaOf<UpdateProfileForm> = yup
  .object()
  .shape({
    name: yup.string().trim().nullable(true),
    username: yup
      .string()
      .trim()
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username cannot exceed 20 characters"),
    email: yup.string().trim().email("Invalid email format"),
    password: yup.string().trim().required(),
    newPassword: yup
      .string()
      .transform((currentvalue) =>
        currentvalue == "" ? undefined : currentvalue
      )
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password cannot exceed 32 characters"),
    confirmNewPassword: yup
      .string()
      .transform((currentvalue) =>
        currentvalue == "" ? undefined : currentvalue
      )
      .trim()
      .oneOf([yup.ref("newPassword"), null], "Passwords do not match")
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password cannot exceed 32 characters"),
  });

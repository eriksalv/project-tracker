import * as yup from "yup";

export interface UpdateProfileForm {
  name?: string | null;
}

export const updateProfileSchema: yup.SchemaOf<UpdateProfileForm> = yup
  .object()
  .shape({
    name: yup.string().trim().nullable(true),
  });

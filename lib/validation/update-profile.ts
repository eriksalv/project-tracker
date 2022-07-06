import * as yup from "yup";

export interface UpdateProfileForm {
  name?: string;
}

export const updateProfileSchema: yup.SchemaOf<UpdateProfileForm> = yup
  .object()
  .shape({
    name: yup.string(),
  });

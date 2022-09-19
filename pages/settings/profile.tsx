import {
  Box,
  Button,
  Card,
  Divider,
  PasswordInput,
  Skeleton,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import useAuthStore from "../../store/auth";
import { Check } from "tabler-icons-react";
import { useMutation, useQueryClient } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  UpdateProfileForm,
  updateProfileSchema,
} from "../../lib/validation/update-profile";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../lib/queries/users";
import { showNotification } from "@mantine/notifications";
import { showError, showSuccess } from "../../lib/notifications";

const Profile = () => {
  const { user, signin } = useAuthStore();
  const queryClient = useQueryClient();

  const formOptions = { resolver: yupResolver(updateProfileSchema) };

  const { register, handleSubmit, formState, reset } =
    useForm<UpdateProfileForm>(formOptions);
  const { errors } = formState;

  const updateProfileMutation = useMutation(
    async (data: UpdateProfileForm) => await updateProfile(data),
    {
      onSuccess: (data) => {
        signin(data);
        const user = data.user!;
        console.log(user);
        queryClient.invalidateQueries(["users", user.id]);
        showNotification({
          ...showSuccess("Updated profile successfully", "update-profile"),
          icon: <Check size={16} />,
        });
        reset();
      },
      onError: (error) => {
        showNotification(showError(error, "update-profile"));
      },
    }
  );

  const onSubmit = (data: UpdateProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {user ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: "960px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card>
            <Title>Edit profile</Title>

            <Divider size={2} sx={{ margin: "0.5rem 0" }} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <PasswordInput
                id="password"
                {...register("password")}
                error={errors.password?.message}
                label="Current password"
                required
              />

              <Divider sx={{ margin: "1rem 0" }} />

              <TextInput
                id="email"
                {...register("email")}
                error={errors.email?.message}
                label="New email"
                defaultValue={user.email}
              />

              <TextInput
                id="username"
                {...register("username")}
                error={errors.username?.message}
                label="New username"
                defaultValue={user.username}
              />

              <TextInput
                id="name"
                {...register("name")}
                error={errors.name?.message}
                label="New name"
                defaultValue={user.name || ""}
              />

              <PasswordInput
                id="newPassword"
                {...register("newPassword")}
                error={errors.newPassword?.message}
                label="New password"
              />

              <PasswordInput
                id="confirmNewPassword"
                {...register("confirmNewPassword")}
                error={errors.confirmNewPassword?.message}
                label="Confirm new password"
              />

              <Divider sx={{ margin: "1rem 0" }} />

              <Button
                color="violet"
                type="submit"
                loading={updateProfileMutation.isLoading}
                leftIcon={<Check size={18} />}
                fullWidth
              >
                Update
              </Button>
            </form>
          </Card>
        </Box>
      ) : (
        <Skeleton height="500px" sx={{ maxWidth: "960px" }} />
      )}
    </Box>
  );
};

export default Profile;

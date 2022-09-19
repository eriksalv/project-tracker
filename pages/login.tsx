import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { LoginForm, loginSchema } from "../lib/validation/signin";
import { signin } from "../lib/queries/auth";
import { useMutation } from "react-query";
import useAuthStore from "../store/auth";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { showError, showSuccess } from "../lib/notifications";
import { Check } from "tabler-icons-react";

const LoginPage = () => {
  const formOptions = { resolver: yupResolver(loginSchema) };

  const { register, handleSubmit, formState } = useForm<LoginForm>(formOptions);
  const { errors } = formState;

  const router = useRouter();

  const { signin: zustandSignin } = useAuthStore();

  const loginMutation = useMutation(
    async (data: LoginForm) => await signin(data),
    {
      onSuccess: (data) => {
        zustandSignin(data);
        router.replace("/home");

        showNotification({
          ...showSuccess("Logged in successfully", "login"),
          icon: <Check size={16} />,
        });
      },
      onError: (error) => {
        showNotification(showError(error, "login"));
      },
    }
  );

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
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
      <Box
        sx={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              id="emailOrUsername"
              label="Email or username"
              {...register("emailOrUsername")}
              error={errors.emailOrUsername?.message}
            />

            <PasswordInput
              id="password"
              label="Password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              loading={loginMutation.isLoading}
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
              Sign in
            </Button>
          </form>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;

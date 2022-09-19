import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { registerSchema, RegisterForm } from "../lib/validation/signup";
import useAuthStore from "../store/auth";
import { useMutation } from "react-query";
import { signup } from "../lib/queries/auth";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { showError, showSuccess } from "../lib/notifications";
import { Check } from "tabler-icons-react";

const RegisterPage = () => {
  const formOptions = { resolver: yupResolver(registerSchema) };

  const { register, handleSubmit, formState } =
    useForm<RegisterForm>(formOptions);
  const { errors } = formState;

  const { signin } = useAuthStore();

  const router = useRouter();

  const registerMutation = useMutation(
    async (data: RegisterForm) => await signup(data),
    {
      onSuccess: (data) => {
        signin(data);
        router.replace("/home");

        showNotification({
          ...showSuccess("Registered successfully", "register"),
          icon: <Check size={16} />,
        });
      },
      onError: (error) => {
        showNotification(showError(error, "register"));
      },
    }
  );

  const onSubmit = async (data: RegisterForm) => {
    registerMutation.mutate(data);
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
              id="email"
              label="Email"
              {...register("email")}
              error={errors.email?.message}
              required
            />

            <TextInput
              id="username"
              label="Username"
              {...register("username")}
              error={errors.username?.message}
              required
            />

            <TextInput
              id="name"
              label="Name"
              {...register("name")}
              error={errors.name?.message}
            />

            <PasswordInput
              id="password"
              {...register("password")}
              label="Password"
              error={errors.password?.message}
              required
            />

            <PasswordInput
              id="confirmPassword"
              {...register("confirmPassword")}
              label="Confirm password"
              error={errors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              loading={registerMutation.isLoading}
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
      </Box>
    </Box>
  );
};

export default RegisterPage;

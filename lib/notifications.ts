import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Something went wrong";
  }

  return "Something went wrong";
}

export function showError(error: unknown, id: string, title?: string) {
  const message = getErrorMessage(error);

  return {
    id,
    title: title || "Error",
    message,
    color: "red",
    autoClose: 4000,
  };
}

export function showSuccess(message: string, id: string, title?: string) {
  return {
    id,
    title: title || "Success",
    message,
    color: "teal",
    autoClose: 4000,
  };
}

export function showInfo(message: string, id: string, title?: string) {
  return {
    id,
    title: title || "Info",
    message,
    autoClose: 4000,
  };
}

export function showLoader(id: string, title?: string) {
  return {
    id,
    loading: true,
    title: title || "Loading",
    message: "Please wait...",
    autoClose: false,
    disallowClose: true,
  };
}

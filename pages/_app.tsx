import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import ApplicationContainer from "../components/layout/ApplicationContainer";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { NotificationsProvider } from "@mantine/notifications";
import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,

              colors: {
                dark: [
                  "#E8E8EE",
                  "#B2B2C7",
                  "#8586A8",
                  "#63648E",
                  "#4B4C6A",
                  "#39394F",
                  "#2B2B3B",
                  "#21212C",
                  "#191921",
                  "#131318",
                ],
              },
            }}
          >
            <NotificationsProvider limit={5}>
              <ApplicationContainer>
                <Component {...pageProps} />
              </ApplicationContainer>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Hydrate>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default MyApp;

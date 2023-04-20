import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { GlobalStyle } from "../components/GlobalStyle";
import Header from "../components/Header";

export default function MyApp({ Component, pageProps }: any) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <Header />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

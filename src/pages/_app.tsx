import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";

import tokyo from "react95/dist/themes/tokyoDark";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={tokyo}>
        <div className={"bg-[url('/windowsHeader16-9.png')]"}>
          <div className={"bg-zinc-950/50"}>
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

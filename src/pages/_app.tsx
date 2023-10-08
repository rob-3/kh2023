import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";

import tokyo from "react95/dist/themes/tokyoDark";
import { Roboto_Flex } from "next/font/google";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

const font = Roboto_Flex({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={tokyo}>
        <div
          className={`h-screen w-screen overflow-y-hidden bg-[url('/windowsHeader16-9.png')] ${font.className}`}
        >
          {/* Usually you dont wanna do overflow hidden but this is hackathon */}
          <div className={"h-full w-full bg-zinc-950/50"}>
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

import Head from "next/head";
import { AppBar, Button, TextInput, Toolbar, Tooltip } from "react95";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

export default function desktopScreen() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Start your Adventure</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full w-full flex-col p-6"
        >
          <div className="mt-20">
            <Tooltip text="Customization" enterDelay={100} leaveDelay={200}>
              <button onClick={() => undefined}>
                <Image
                  className="m-2"
                  src="/ComputerIcon.png"
                  alt="Example Image"
                  width={100}
                  height={100}
                />
              </button>
            </Tooltip>

            <Tooltip text="Secret" enterDelay={100} leaveDelay={200}>
              <button onClick={() => void router.push("/chat")}>
                <Image
                  className="m-2"
                  src="/FolderIcon.png"
                  alt="Example Image"
                  width={100}
                  height={100}
                />
              </button>
            </Tooltip>

            <div className="absolute bottom-10  left-10">
              <Tooltip text="Recycle‍" enterDelay={100} leaveDelay={200}>
                <button onClick={() => undefined}>
                  <Image
                    className="m-2"
                    src="/RecycleIcon.png"
                    alt="Example Image"
                    width={100}
                    height={100}
                  />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="absolute bottom-10  left-10">
            <AppBar>
              <Toolbar style={{ justifyContent: "space-between" }}>
                <div style={{ display: "inline-block" }}>
                  <Button>Start</Button>
                </div>
                <TextInput placeholder="Search..." width={150} />
              </Toolbar>
            </AppBar>
          </div>
        </motion.div>
      </main>
    </>
  );
}

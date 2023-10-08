import Head from "next/head";
import { AppBar, Button, TextInput, Toolbar, Tooltip } from "react95";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Start your adventure</title>
        <link rel="icon" href="/adventure.jpg" />
      </Head>
      <main className="h-screen w-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full w-full flex-col p-6"
        >
          <div className="mt-16 flex gap-8">
            <Tooltip text="Customization" enterDelay={100} leaveDelay={200}>
              <button onClick={() => undefined}>
                <Image
                  src="/ComputerIcon.png"
                  alt="Example Image"
                  width={100}
                  height={100}
                  draggable={false}
                />
              </button>
            </Tooltip>

            <Tooltip text="adventure.exe" enterDelay={100} leaveDelay={200}>
              <button onClick={() => void router.push("/character")}>
                <Image
                  src="/adventure.jpg"
                  alt="LegendsoftheSkywardPirates game"
                  width={100}
                  height={100}
                  draggable={false}
                />
              </button>
            </Tooltip>
          </div>

          <div className="absolute bottom-10  left-10">
            <Tooltip text="Recycle‍" enterDelay={100} leaveDelay={200}>
              <button onClick={() => undefined}>
                <Image
                  className="m-2"
                  src="/RecycleIcon.png"
                  alt="Example Image"
                  width={100}
                  height={100}
                  draggable={false}
                />
              </button>
            </Tooltip>
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

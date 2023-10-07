import Head from "next/head";
import { AppBar, Button, TextInput, Toolbar, Tooltip } from "react95";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
  const { data, isLoading } = api.example.hello.useQuery({ text: "from tRPC" });

  const [messages, setMessage] = useState<Message[]>([
    { text: "Choose your character", isPlayer: false },
  ]);

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
          className="flex h-full w-full flex-col items-center justify-center p-6"
        >
          {isLoading ? (
            <Hourglass size={48} />
          ) : (
            <Window
              className={
                "h-full w-full max-w-4xl !bg-zinc-900/70 backdrop-blur-md"
              }
            >
              <WindowHeader className={"flex justify-between"}>
                <span>adventure.exe</span>
                <Button>X</Button>
              </WindowHeader>
              <WindowContent>
                <div className="flex flex-col gap-9 p-8">
                  {messages.map(({ isPlayer, text }, i) => (
                    <div
                      key={i}
                      className={`text-white ${isPlayer ? "self-end" : ""}`}
                    >
                      <span className="p-4 ring-2 ring-zinc-100">{text}</span>
                    </div>
                  ))}
                  
                  <Button variant="default" className="w-1">
                    <span className="text-black">next</span>
                  </Button>
                </div>
              </WindowContent>
            </Window>
          )}
        </motion.div>
      </main>
    </>
  );
}

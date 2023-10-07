import Head from "next/head";

import { api } from "~/utils/api";
import {
  Button,
  Hourglass,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { motion } from "framer-motion";
import { useState } from "react";

interface Message {
  text: string;
  isPlayer: boolean;
}

export default function Home() {
  const { data, isLoading } = api.example.hello.useQuery({ text: "from tRPC" });

  const [messages, setMessage] = useState<Message[]>([
    { text: "Hello", isPlayer: true },
    { text: "How are you?", isPlayer: false },
    { text: "What is the best way to do this?", isPlayer: true },
    { text: "Howdy!", isPlayer: false },
    { text: "Yay next.js", isPlayer: true },
  ]);

  
  function exitButton() {
    window.location.href = '/desktopScreen';
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
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
                <Button onClick={exitButton}>X</Button>
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
                </div>
              </WindowContent>
            </Window>
          )}
        </motion.div>
      </main>
    </>
  );
}

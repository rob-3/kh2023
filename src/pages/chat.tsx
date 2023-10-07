import Head from "next/head";
import {
  Button,
  Frame,
  Hourglass,
  TextInput,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useChat } from "ai/react";

interface Message {
  text: string;
  isPlayer: boolean;
}

export default function Chat() {
  const router = useRouter();

  const { messages, handleSubmit, isLoading, handleInputChange, input } =
    useChat({
      api: "/api/chat",
    });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-full w-full flex-col items-center justify-center p-6"
        >
          <Window
            className={
              "h-full w-full max-w-4xl !bg-zinc-900/70 backdrop-blur-md"
            }
          >
            <WindowHeader className={"flex select-none justify-between"}>
              <span>adventure.exe</span>
              <Button onClick={() => void router.push("/")}>X</Button>
            </WindowHeader>
            <WindowContent
              className={"flex h-full flex-col justify-end gap-4 !pb-8"}
            >
              <ul className="flex flex-col gap-4 overflow-y-auto">
                {messages.map(({ content, id, role }, i) => (
                  <li
                    key={id}
                    className={`flex gap-2 ${
                      role === "user" ? "flex-row-reverse self-end" : ""
                    }`}
                  >
                    <div className={"h-8 w-8 text-center sm:h-12 sm:w-12"}>
                      {role === "user" ? "👨‍💻" : "🤖"}
                    </div>
                    <Frame
                      variant="outside"
                      shadow
                      className={`flex w-fit items-center px-2 py-1 text-white ring-2 ring-zinc-100 sm:px-4 sm:py-2`}
                    >
                      <span>{content}</span>
                      {isLoading &&
                        i === messages.length - 1 &&
                        role !== "user" && (
                          <span className={"animate-pulse"}>|</span>
                        )}
                    </Frame>
                  </li>
                ))}
                {messages.length === 0 && (
                  <div className={"flex justify-center"}>
                    <span>Say something!</span>
                  </div>
                )}
              </ul>

              <form onSubmit={handleSubmit} className={"flex gap-2"}>
                <TextInput
                  value={input}
                  placeholder="What do you want to say?"
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button
                  disabled={isLoading || input.length === 0}
                  type={"submit"}
                >
                  {isLoading ? <Hourglass size={24} /> : "Say"}
                </Button>
              </form>
            </WindowContent>
          </Window>
        </motion.div>
      </main>
    </>
  );
}

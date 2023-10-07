import Head from "next/head";
import { useState } from "react";

import { api } from "~/utils/api";

interface Message {
  text: string;
  isPlayer: boolean;
}

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [messages, setMessage] = useState<Message[]>([
    { text: 'Hello', isPlayer: true },
    { text: 'How are you?', isPlayer: false },
    { text: 'What is the best way to do this?', isPlayer: true },
    { text: 'Howdy!', isPlayer: false },
    { text: 'Yay next.js', isPlayer: true },
  ]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen bg-[url('/windowsHeader16-9.png')]">
        <div className="bg-[#140420] opacity-60 w-full h-full pt-40 ">
        <div className="flex flex-col gap-6 p-8">
          {messages.map(({ isPlayer, text }, i) => (
            <div
              key={i}
              className={`text-white ${isPlayer ? 'self-end' : ''}`}
            >
              <span className='border p-2 rounded'>
              {text}
              </span>
            </div>
          ))}
        </div>
        </div>
      </main>
    </>
  );
}

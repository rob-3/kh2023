import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Frame,
  GroupBox,
  Hourglass,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";

const character = {
  "1": {
    name: "Lirael Stormblade",
    story:
      "Lirael Stormblade, born in Stormhaven, embraced piracy, seeking adventure and treasure on the high seas. Her legend grew as a fearless, cunning pirate captain.",
    image: "/Lirael.jpg",
    items: {
      gold: 18,
      pistol: 2,
    },
  },
  "2": {
    name: "Luffy Leinecker",
    story:
      'A 25-year-old deckhand, endured relentless bullying aboard the "Scarlet Serpent," seeking escape through friendship, a hidden treasure map, will he find the one piece?',
    image: "/Leinecker.png",
    items: {
      gold: 25,
      pistol: 1,
      parrot: 1,
    },
  },
  "3": {
    name: "Morgan",
    story:
      "Once a poor sailor for the navy is killed by pirates but is now undead, seeking revenge on the pirates that killed him. Morgan and his mates are now cursed to sail the seas forever for treasure and revenge.",
    image: "/Morgan.jpg",
    items: {
      gold: 15,
      pistol: 1,
      cutlass: 1,
    },
  },
};

export default function Character() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<"1" | "2" | "3">("2");

  const [savedCharacter, saveCharacter] = useLocalStorage<{
    name: string;
    story: string;
    image: string;
    items: Record<string, number>;
  } | null>("adventure-character", null);

  useEffect(() => {
    let timeout = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    setTimeout(() => {
      setIsLoading(false);
    }, timeout);
  }, [selected]);

  const handleCharacterSubmit = () => {
    void router.push("/chat");
    saveCharacter(character[selected]);
  };
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
          className="flex h-full w-full flex-col items-center justify-center p-6 sm:h-auto "
        >
          {isLoading ? (
            <div className="my-auto flex h-full w-full items-center justify-center">
              <Hourglass size={48} />
            </div>
          ) : (
            <Window
              className={
                "h-full w-full max-w-4xl !bg-zinc-900/70 backdrop-blur-md"
              }
            >
              <WindowHeader className={"flex justify-between"}>
                <span>adventure.exe</span>
                <Button
                  onClick={() => {
                    void router.push("/");
                  }}
                >
                  X
                </Button>
              </WindowHeader>
              <WindowContent className="flex h-full flex-col justify-between gap-2 !px-0 !pb-8 sm:!pb-0">
                <div className="flex flex-col items-center !overflow-y-auto px-2 sm:flex-row sm:justify-evenly ">
                  <GroupBox
                    label="Captain Lirael Stormblade "
                    className="w-full sm:h-[30rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full flex-col items-center justify-center">
                        <Image
                          src="/Lirael.jpg"
                          width={200}
                          height={200}
                          alt="character"
                        />
                        <p className="p-2 text-center">
                          Lirael Stormblade, born in Stormhaven, embraced
                          piracy, seeking adventure and treasure on the high
                          seas. Her legend grew as a fearless, cunning pirate
                          captain.
                        </p>
                        <p>Starting Items: 18 gold, 2 pistols</p>
                        <Button
                          className="mt-auto"
                          onClick={() => {
                            setSelected("1");
                          }}
                          variant={selected === "1" ? "flat" : "default"}
                        >
                          <span className="text-black">select</span>
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                  <GroupBox
                    label="Captain Luffy Leinecker"
                    className="w-full sm:h-[30rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full flex-col items-center justify-center">
                        <Image
                          src="/Leinecker.png"
                          width={200}
                          height={200}
                          alt="character"
                        />
                        <p className="p-2 text-center">
                          A 31-year-old deckhand, endured relentless bullying
                          aboard the "Scarlet Serpent," seeking escape through
                          friendship, a hidden treasure map, will he find the
                          one piece?
                        </p>
                        <p>Starting Items: 25 gold, 1 pistol, 1 parrot</p>
                        <Button
                          className="mt-auto"
                          onClick={() => {
                            setSelected("2");
                          }}
                          variant={selected === "2" ? "flat" : "default"}
                        >
                          <span className="text-black">select</span>
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                  <GroupBox
                    label="Deck Hand Morgan"
                    className="w-full sm:h-[30rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full flex-col items-center justify-center">
                        <Image
                          src="/Morgan.jpg"
                          width={200}
                          height={200}
                          alt="character"
                        />
                        <p className="p-1 text-center">
                          Once a poor sailor for the navy is killed by pirates
                          but is now undead, seeking revenge on the pirates that
                          killed him. Morgan and his mates are now cursed to
                          sail the seas forever for treasure and revenge.
                        </p>
                        <p>Starting Items: 15 gold, 1 pistol, 1 cutlass</p>
                        <Button
                          className="mt-auto"
                          onClick={() => {
                            setSelected("3");
                          }}
                          variant={selected === "3" ? "flat" : "default"}
                        >
                          <span className="text-black">select</span>
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                </div>
                <Button
                  variant="default"
                  className="w-1"
                  onClick={handleCharacterSubmit}
                >
                  <span className="text-black">next</span>
                </Button>
              </WindowContent>
            </Window>
          )}
        </motion.div>
      </main>
    </>
  );
}

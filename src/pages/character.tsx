import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import useInventory from "~/hooks/useInventory";
import trpc from "~/pages/api/trpc/[trpc]";
import { api } from "~/utils/api";
import useSavedCharacter from "~/hooks/useSavedCharacter";

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
      "Once a poor sailor for the navy, he was killed by pirates but is now undead, seeking revenge on the pirates that killed him. Morgan and his mates are now cursed to sail the seas forever for treasure and revenge.",
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

  const [inventory, setInventory] = useInventory();
  const [savedCharacter, saveCharacter] = useSavedCharacter();

  useEffectOnce(() => {
    const timeout = Math.floor(Math.random() * (1000 - 1000 + 1)) + 1000;
    const shorterTimeout = Math.floor(Math.random() * (500 - 500 + 1)) + 500;

    setTimeout(() => {
      if (savedCharacter) {
        void router.replace("/chat");
      }
    }, shorterTimeout);

    setTimeout(() => {
      setIsLoading(false);
    }, timeout);
  });

  const { mutateAsync: mutateGenerateSituation } =
    api.generate.story.useMutation();

  const handleCharacterSubmit = async () => {
    setIsLoading(true);

    const situation = await mutateGenerateSituation({
      story: character[selected].story,
    }).catch(console.error);
    if (!situation) {
      setIsLoading(false);
      return;
    }
    saveCharacter({
      ...character[selected],
      situation,
    });
    setInventory(character[selected].items);

    await router.push("/chat");
  };

  return (
    <>
      <Head>
        <title>Select character</title>
        <link rel="icon" href="/adventure.jpg" />
      </Head>
      <main className="h-screen w-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex h-full w-full flex-col items-center justify-center p-6`}
        >
          {isLoading ? (
            <div className="m-auto">
              <Hourglass size={48} />
            </div>
          ) : (
            <Window
              className={
                "h-full max-h-[39rem] w-full max-w-4xl !bg-zinc-900/70 backdrop-blur-md"
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
              <WindowContent className="flex h-full flex-col justify-between gap-2 !px-0 !pb-8">
                <div className="flex flex-col items-center !overflow-y-auto px-2 sm:flex-row sm:justify-evenly ">
                  <GroupBox
                    label="Captain Lirael Stormblade"
                    className="w-full sm:h-[31rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full w-full flex-col items-center justify-center">
                        <Image
                          src="/Lirael.jpg"
                          width={200}
                          height={200}
                          alt="character"
                          draggable={false}
                        />
                        <p className="p-2 text-center">
                          Lirael Stormblade, born in Stormhaven, embraced
                          piracy, seeking adventure and treasure on the high
                          seas. Her legend grew as a fearless, cunning pirate
                          captain.
                        </p>
                        <div
                          className={
                            "mt-auto flex flex-col items-center justify-center text-green-400"
                          }
                        >
                          <span>Starting Items</span>
                          <span>18 gold, 2 pistols</span>
                        </div>
                        <Button
                          className="mt-2 w-full"
                          onClick={() => {
                            setSelected("1");
                          }}
                          variant={selected === "1" ? "flat" : "default"}
                        >
                          Select
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                  <GroupBox
                    label="Captain Luffy Leinecker"
                    className="w-full sm:h-[31rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full flex-col items-center justify-center">
                        <Image
                          src="/Leinecker.png"
                          width={200}
                          height={200}
                          alt="character"
                          draggable={false}
                        />
                        <p className="p-2 text-center">
                          A 31-year-old deckhand, endured relentless bullying
                          aboard the "Scarlet Serpent," seeking escape through
                          friendship, a hidden treasure map, will he find the
                          one piece?
                        </p>
                        <div
                          className={
                            "mt-auto flex flex-col items-center justify-center text-green-400"
                          }
                        >
                          <span>Starting Items</span>
                          <span>25 gold, 1 pistol, 1 parrot</span>
                        </div>
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setSelected("2");
                          }}
                          variant={selected === "2" ? "flat" : "default"}
                        >
                          Select
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                  <GroupBox
                    label="Deck Hand Morgan"
                    className="w-full sm:h-[31rem]"
                  >
                    <Frame className="h-full w-full p-2">
                      <div className="w-25 flex h-full flex-col items-center">
                        <Image
                          src="/Morgan.jpg"
                          width={200}
                          height={200}
                          alt="character"
                          draggable={false}
                        />
                        <p className="p-1 text-center">
                          Once a poor sailor for the navy, he was killed by pirates
                          but is now undead, seeking revenge on the pirates that
                          killed him. Morgan and his mates are now cursed to
                          sail the seas forever for treasure and revenge.
                        </p>
                        <div
                          className={
                            "mt-auto flex flex-col items-center justify-center text-green-400"
                          }
                        >
                          <span>Starting Items</span>
                          <span>15 gold, 1 pistol, 1 cutlass</span>
                        </div>
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setSelected("3");
                          }}
                          variant={selected === "3" ? "flat" : "default"}
                        >
                          Select
                        </Button>
                      </div>
                    </Frame>
                  </GroupBox>
                </div>
                <Button variant="default" onClick={handleCharacterSubmit}>
                  Next
                </Button>
              </WindowContent>
            </Window>
          )}
        </motion.div>
      </main>
    </>
  );
}

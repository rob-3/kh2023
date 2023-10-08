import Head from "next/head";
import {
  Button,
  Frame,
  GroupBox,
  Handle,
  Hourglass,
  TextInput,
  Toolbar,
  Tooltip,
  type TreeLeaf,
  TreeView,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useChat } from "ai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Message } from "ai";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import useInventory from "~/hooks/useInventory";
import { MdInventory2 } from "react-icons/md";
import InventoryWindow from "~/components/InventoryWindow";
import Image from "next/image";

type ParsedMessage = {
  text: string;
  characterName?: string;
  trade?: Record<string, number>;
};

// TODO
const INITIAL_PROMPT = "";

const parseMessage = (content: string): ParsedMessage => {
  const re = /{.*}/gs;
  const contentToParse = content.match(re)?.[0] ?? content;
  console.log(content.match(re));
  // If parsing fail return the message as is
  try {
    return JSON.parse(contentToParse) as ParsedMessage;
  } catch {
    // Partially parse in case it is streaming
    const trimmed = contentToParse.trim();
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex !== -1) {
      let text = trimmed
        .slice(colonIndex + 1)
        .trim()
        .replace(/^"/, "");

      const nextQuoteIndex = text.indexOf('"');
      if (nextQuoteIndex !== -1) {
        text = text.slice(0, nextQuoteIndex);
      }

      return { text };
    }

    return {
      text: contentToParse,
    };
  }
};

export default function Chat() {
  const router = useRouter();

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const [inventory, setInventory] = useInventory();
  const [localMessages, setLocalMessages] = useLocalStorage<Message[]>(
    "adventure-messages",
    [],
  );
  const [localCharacterPics, setLocalCharacterPics] = useLocalStorage<
    Record<string, string>
  >("character-pics", {});
  const [localItemPics, setLocalItemPics] = useLocalStorage<
    Record<string, string>
  >("item-pics", {});

  const makeNewItemImage = (name: string) => {
    if (!localItemPics[name]) {
      void fetch("/api/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `A fantasy item oil painting of ${name}`,
        }),
      })
        .then((res) => res.json())
        .then(({ imageURL }) => {
          setLocalItemPics((prev) => {
            return {
              ...prev,
              [name]: imageURL,
            };
          });
        });
    }
  };

  const [pendingTrade, setPendingTrade] = useState<Record<
    string,
    number
  > | null>(null);
  const treeLeaf = useMemo(() => {
    if (!pendingTrade) return null;
    const leaf: TreeLeaf<string>[] = [];
    leaf.push({
      id: "give",
      label: "Give",
      icon: <>{"<"}</>,
      items: [],
    });
    leaf.push({
      id: "receive",
      label: "Receive",
      icon: <>{">"}</>,
      items: [],
    });

    for (const [key, value] of Object.entries(pendingTrade)) {
      // Keep sign and show amount with name
      makeNewItemImage(key);
      const label = `${value < 0 ? "-" : "+"} ${Math.abs(value)} ${key}`;
      if (value < 0) {
        leaf[0]?.items?.push({
          id: key,
          label: label,
        });
      } else {
        leaf[1]?.items?.push({
          id: key,
          label: label,
        });
      }
    }

    return leaf;
  }, [pendingTrade]);

  // useEffect(() => {}, []);

  const interval = useRef<NodeJS.Timeout | null>(null);

  const isTradePossible = useMemo(() => {
    if (!pendingTrade) return false;
    for (const [name, value] of Object.entries(pendingTrade)) {
      const inventoryValue = inventory[name] ?? 0;
      if (value < 0 && inventoryValue - value < 0) {
        return false;
      }
    }
    return true;
  }, [inventory, pendingTrade]);

  const {
    messages,
    handleSubmit: _handleSubmit,
    handleInputChange,
    setMessages,
    input,
    isLoading,
  } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      setTimeout(() => {
        interval.current && clearInterval(interval.current);
        interval.current = null;
      }, 300);
      const { trade: newInventory, characterName } = parseMessage(
        message.content,
      );
      if (characterName && !localCharacterPics[characterName]) {
        void fetch("/api/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `A fantasy character profile oil painting of ${characterName}`,
          }),
        })
          .then((res) => res.json())
          .then(({ imageURL }) => {
            setLocalCharacterPics((prev) => {
              return {
                ...prev,
                [characterName]: imageURL as string,
              };
            });
          });
      }
      if (newInventory) {
        setPendingTrade(newInventory);
      }
    },
  });

  const ulRef = useRef<HTMLUListElement>(null);

  const handleSubmit = (...args: Parameters<typeof _handleSubmit>) => {
    interval.current = setInterval(() => {
      ulRef.current?.scrollTo({
        top: ulRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
    _handleSubmit(...args);
  };

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages, setLocalMessages]);

  useEffectOnce(() => {
    setMessages(localMessages);
  });

  const handleRejectTrade = () => {
    setPendingTrade(null);
  };

  const handleAcceptTrade = () => {
    const newInventory = pendingTrade ?? {};
    for (const [key, value] of Object.entries(newInventory)) {
      makeNewItemImage(key);
      if (inventory[key]) {
        newInventory[key] += inventory[key] ?? 0;
      } else {
        newInventory[key] = value;
      }
    }

    setInventory((prev) => ({
      ...prev,
      ...newInventory,
    }));
    setPendingTrade(null);
  };

  const [savedCharacter] = useLocalStorage<{
    name: string;
    story: string;
    image: string;
    items: Record<string, number>;
  } | null>("adventure-character", null);

  const characterImg = savedCharacter?.image ?? "";
  useEffectOnce(() => {
    if (localMessages.length > 0) {
      setMessages(localMessages);
    } else {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "system",
          content: savedCharacter!.story,
        },
        {
          id: crypto.randomUUID(),
          role: "system",
          content: INITIAL_PROMPT,
        },
      ]);
    }
  });

  return (
    <>
      <Head>
        <title>Adventure</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-full w-full flex-col items-center justify-center p-6"
        >
          <AnimatePresence>
            {isInventoryOpen && (
              <motion.div
                initial={{ right: "-100%" }}
                animate={{ right: 0 }}
                exit={{ right: "-100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className={
                  "absolute right-0 top-0 z-50 h-full w-full max-w-sm pb-4 pt-4"
                }
              >
                <InventoryWindow onClose={() => setIsInventoryOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          <Window
            className={
              "flex h-full w-full max-w-4xl flex-col !bg-zinc-900/70 backdrop-blur-md"
            }
          >
            <WindowHeader className={"flex select-none justify-between"}>
              <span>adventure.exe</span>
              <Button onClick={() => void router.push("/")}>X</Button>
            </WindowHeader>
            <Toolbar>
              <Handle size={32} />
              <Button
                variant="menu"
                onClick={() => {
                  setMessages([
                    {
                      id: crypto.randomUUID(),
                      role: "system",
                      content: savedCharacter!.story,
                    },
                    {
                      id: crypto.randomUUID(),
                      role: "system",
                      content: INITIAL_PROMPT,
                    },
                  ]);
                }}
              >
                Start Anew
              </Button>
              <Handle size={32} />
              <Handle size={32} className={"ml-auto"} />
              <Button
                variant="menu"
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              >
                Inventory <MdInventory2 className={"ml-1"} />
              </Button>
              <Handle size={32} />
            </Toolbar>
            <WindowContent
              className={"flex h-full flex-col justify-end gap-4 !pb-20"}
            >
              <ul ref={ulRef} className="flex flex-col gap-4 overflow-y-auto">
                {messages.map(({ content, id, role }, i) => (
                  <li
                    key={id}
                    className={`flex gap-2 ${
                      role === "user" ? "flex-row-reverse self-end" : ""
                    }`}
                  >
                    <Tooltip
                      text={
                        role === "user"
                          ? "You"
                          : parseMessage(content).characterName ?? "Unknown"
                      }
                    >
                      <div className={"h-8 w-8 text-center sm:h-12 sm:w-12"}>
                        {role === "user" ? (
                          <Image
                            src={characterImg}
                            width={48}
                            height={48}
                            alt={"Character image"}
                          />
                        ) : localCharacterPics[
                            parseMessage(content).characterName!
                          ] ? (
                          <Image
                            src={
                              localCharacterPics[
                                parseMessage(content).characterName!
                              ]!
                            }
                            width={48}
                            height={48}
                            alt={"Character image"}
                          />
                        ) : (
                          "?"
                        )}
                      </div>
                    </Tooltip>
                    <Frame
                      variant="outside"
                      shadow
                      className={`flex w-fit items-center px-2 py-1 text-white ring-2 ring-zinc-100 sm:px-4 sm:py-2`}
                    >
                      <span>{parseMessage(content).text}</span>
                      {isLoading &&
                        i === messages.length - 1 &&
                        role !== "user" && (
                          <span className={"animate-pulse"}>|</span>
                        )}
                    </Frame>
                  </li>
                ))}
                {messages.length < 3 && (
                  <div className={"flex justify-center"}>
                    <span>Say something!</span>
                  </div>
                )}
              </ul>

              {treeLeaf && (
                <div className={"flex max-w-sm flex-col gap-2 self-end"}>
                  <GroupBox label="Trade Offer">
                    <TreeView tree={treeLeaf} />
                  </GroupBox>
                  <div className={"flex justify-end gap-2"}>
                    <Button onClick={handleRejectTrade}>
                      This offer sucks
                    </Button>
                    <Button
                      disabled={!isTradePossible}
                      onClick={handleAcceptTrade}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              )}

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

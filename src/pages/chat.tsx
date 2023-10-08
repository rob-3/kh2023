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
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { type Message } from "ai";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import useInventory from "~/hooks/useInventory";
import { MdInventory2 } from "react-icons/md";
import InventoryWindow from "~/components/InventoryWindow";
import Image from "next/image";
import { Toast } from "next/dist/client/components/react-dev-overlay/internal/components/Toast";
import useSavedCharacter from "~/hooks/useSavedCharacter";

type ParsedMessage = {
  text: string;
  characterName?: string;
  trade?: Record<string, number>;
};

const parseMessage = (content: string): ParsedMessage => {
  const re = /{.*}/gs;
  const contentToParse = content.match(re)?.[0] ?? content;

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

  const [isLoadingCharacterPic, setIsLoadingCharacterPic] = useState(false);

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const [localSavedCharacter, setLocalSavedCharacter] = useSavedCharacter();
  const [localInventory, setLocalInventory] = useInventory();
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
              [name]: imageURL as string,
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

  const interval = useRef<NodeJS.Timeout | null>(null);

  const isTradeInvalid = useMemo(() => {
    if (!pendingTrade) return false;

    const requiredItems = Object.entries(pendingTrade).filter(
      ([, value]) => value < 0,
    );

    const invalid = requiredItems.some(([name, value]) => {
      if (
        !localInventory[name] ||
        (localInventory[name] ?? 0) < Math.abs(value)
      ) {
        console.log("trade not possible:", name, localInventory[name], value);
        return true;
      }
    });

    return invalid;
  }, [localInventory, pendingTrade]);

  const { messages, setMessages, input, setInput, isLoading, append } = useChat(
    {
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
          setIsLoadingCharacterPic(true);
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
                setIsLoadingCharacterPic(false);
                return {
                  ...prev,
                  [characterName]: imageURL as string,
                };
              });
            })
            .catch((e) => {
              setIsLoadingCharacterPic(false);
              console.error(e);
            });
        }
        if (newInventory) {
          setPendingTrade(newInventory);
        }
      },
    },
  );

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages, setLocalMessages]);

  useEffectOnce(() => {
    if (localMessages.length > 0) {
      setMessages(localMessages);
    } else {
      if (!localSavedCharacter) return;

      setMessages([
        {
          id: crypto.randomUUID(),
          role: "system",
          content: JSON.stringify({
            text: localSavedCharacter.story,
            characterName: "narrator",
          }),
        },
        {
          id: crypto.randomUUID(),
          role: "system",
          content: JSON.stringify({
            text: localSavedCharacter.situation,
            characterName: "narrator",
          }),
        },
      ]);
    }

    // Iterate through localInventory and make sure all items have images
    for (const [name] of Object.entries(localInventory)) {
      makeNewItemImage(name);
    }
  });

  const ulRef = useRef<HTMLUListElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || pendingTrade) return;
    setInput("");

    interval.current = setInterval(() => {
      ulRef.current?.scrollTo({
        top: ulRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }, 200);

    void append({
      id: crypto.randomUUID(),
      role: "user",
      content: JSON.stringify({
        text: input,
        characterName: localSavedCharacter?.name,
      }),
    }).catch(console.error);
  };

  const handleRejectTrade = () => {
    setPendingTrade(null);
  };

  const handleAcceptTrade = () => {
    const newInventory = pendingTrade ?? {};
    for (const [key, value] of Object.entries(newInventory)) {
      makeNewItemImage(key);
      if (localInventory[key]) {
        newInventory[key] += localInventory[key] ?? 0;
      } else {
        newInventory[key] = value;
      }
    }

    setLocalInventory((prev) => ({
      ...prev,
      ...newInventory,
    }));
    setPendingTrade(null);
  };

  const characterImg = localSavedCharacter?.image ?? "";

  console.log(isTradeInvalid);

  return (
    <>
      <Head>
        <title>Adventure</title>
        <link rel="icon" href="/adventure.jpg" />
      </Head>
      <main className="h-full w-full">
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
              "flex h-full w-full max-w-4xl flex-col overflow-y-hidden !bg-zinc-900/70 backdrop-blur-md"
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
                  setLocalMessages([]);
                  setLocalSavedCharacter(null);
                  void router.push("/character");
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
              className={"flex h-full flex-col justify-end gap-4 !px-0 !pb-20"}
            >
              <ul
                ref={ulRef}
                className="flex flex-col gap-4 overflow-y-auto px-4"
              >
                {messages.map(({ content, id, role }, i) => {
                  console.log(content);
                  const { text, characterName } = parseMessage(content);
                  return (
                    <li
                      key={id}
                      className={`flex gap-2 ${
                        role === "user" ? "flex-row-reverse self-end" : ""
                      }`}
                    >
                      {![0, 1].includes(i) && (
                        <Tooltip
                          text={
                            role === "user" ? "You" : characterName ?? "Unknown"
                          }
                          position={role === "user" ? "left" : "right"}
                          enterDelay={100}
                          leaveDelay={200}
                          className={"text-black"}
                        >
                          <div className={"flex h-10 w-10 sm:h-14 sm:w-14"}>
                            {characterName === "narrator" ? 
                              <Image
                                src={ "/help_question_mark.png" }
                                width={64}
                                height={64}
                                alt={"Character image"}
                                className={"object-cover"}
                                draggable={false}
                              />
                            : isLoadingCharacterPic &&
                            role !== "user" &&
                            !localCharacterPics[characterName ?? ""] ? (
                              <Hourglass size={48} />
                            ) : (
                              <Image
                                src={
                                  role === "user"
                                    ? characterImg
                                    : localCharacterPics[characterName ?? ""] ??
                                      "/help_question_mark.png"
                                }
                                width={64}
                                height={64}
                                alt={"Character image"}
                                className={"object-cover"}
                                draggable={false}
                              />
                            )}
                          </div>
                        </Tooltip>
                      )}
                      <Frame
                        variant={role === "user" ? "well" : "inside"}
                        shadow
                        className={`flex w-fit items-center px-2 py-1 text-white ring-2 ring-zinc-100 sm:px-4 sm:py-2`}
                      >
                        {text}
                        {isLoading &&
                          i === messages.length - 1 &&
                          role !== "user" && (
                            <span className={"animate-pulse"}>|</span>
                          )}
                      </Frame>
                    </li>
                  );
                })}
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
                      disabled={isTradeInvalid}
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
                  onChange={(e) => setInput(e.target.value)}
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

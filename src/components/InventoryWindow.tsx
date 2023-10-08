import useInventory from "../hooks/useInventory";
import { AnimatePresence, motion } from "framer-motion";
import {
  AppBar,
  Button,
  Frame,
  ScrollView,
  TextInput,
  Toolbar,
  Tooltip,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";
import { useState } from "react";

export default function InventoryComponent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [inventory] = useInventory();

  const [localItemPics] = useLocalStorage<Record<string, string>>(
    "item-pics",
    {},
  );

  return (
    <Window
      className={
        "h-full w-full max-w-4xl content-center !bg-zinc-900/90 backdrop-blur-md"
      }
    >
      <WindowHeader className={"flex select-none justify-between"}>
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant={"flat"}
          placeholder="Search Inventory..."
          className={"-ml-2 -mt-1 mr-1"}
          fullWidth
        />
        <Button onClick={() => onClose()}>X</Button>
      </WindowHeader>
      <WindowContent>
        {Object.entries(inventory).length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center font-medium">No items :(</div>
          </div>
        ) : (
          <ul className={"flex select-none flex-wrap gap-6"}>
            {Object.entries(inventory).map(([name, amount]) => {
              if (search && !name.toLowerCase().includes(search.toLowerCase()))
                return null;

              return (
                <motion.li
                  layout
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Frame
                    key={name}
                    variant="inside"
                    shadow
                    className="relative flex w-24 flex-col items-center justify-center p-2"
                  >
                    <Image
                      className="m-3"
                      src={localItemPics[name] ?? "/help_sheet.png"}
                      alt="Example Image"
                      width={50}
                      height={50}
                      draggable={false}
                    />
                    <Tooltip
                      text={name}
                      enterDelay={100}
                      leaveDelay={200}
                      className={"text-black"}
                    >
                      <div className="w-[4.5rem] truncate text-center font-medium">
                        {name}
                      </div>
                    </Tooltip>
                    <div className="absolute left-1 top-0 text-center text-sm font-medium">
                      x{amount}
                    </div>
                  </Frame>
                </motion.li>
              );
            })}
          </ul>
        )}
      </WindowContent>
    </Window>
  );
}

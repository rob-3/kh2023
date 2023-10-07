import React from 'react';
import useInventory from '../hooks/useInventory'; // Import the useInventory hook
import { motion } from 'framer-motion';
import router, { useRouter } from "next/router";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { type Message } from "ai";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { WindowContent, WindowHeader } from 'react95';

import {
  Button,
  Frame,
  Hourglass,
  TextInput,
  Window,

} from "react95";

type test = {
  id:number;
  name: string;
  description:string;
  value:number;
}

function InventoryComponent() {
  // Use the useInventory hook to access the inventory data
  const [inventory] = useInventory();

  const inventory2: test[] = [{id:1,name:"arm",description:"a magica man", value:30},{id:2,name:"penny",description:"the most prized coin in all of history", value:3},
  {id:3,name:"penny",description:"the most prized coin in all of history", value:3},{id:0,name:"penny",description:"the most prized coin in all of history", value:3}]
  const imageUrl: string[] = ['/icon1.png','/icon2.png','/icon3.png','/icon4.png'];

  return (

    <>
      
      <main className="h-screen w-screen">
    <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex h-full w-full flex-col items-center justify-center p-6"
    >
     
    <Window
      className={
        "h-full w-full max-w-4xl !bg-zinc-900/70 backdrop-blur-md content-center"
      }
    >
      <WindowHeader className={"flex select-none justify-between"}>
        <span>Inventory</span>
        <Button onClick={() => void router.push("/")}>X</Button>
      </WindowHeader>
      <WindowContent
       
      >
        
       
        {inventory2.map((item) => (
          
          <div className="">
        
          <motion.div
         whileHover={{
          opacity: .5
        }}
        whileTap={{ scale: 0.9 }}
        >
           <img    
                    className="m-5 p-2"
                    src={imageUrl[item.id%4]}
                    alt="Example Image"
                    width={50}
                    height={50}
                  />
                  </motion.div>
          <div className="font-medium color-white w-10 m-5">
              {item.name.toUpperCase()}
          </div>
       
          </div >
       
      ))}
       
      </WindowContent>
      
    </Window>
    </motion.div>
    </main>
    </>
  );
}

export default InventoryComponent;







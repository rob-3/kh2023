import React, { useState } from 'react';
import useInventory from '../hooks/useInventory'; // Import the useInventory hook
import { motion } from 'framer-motion';
import router, { useRouter } from "next/router";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { type Message } from "ai";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { ScrollView, WindowContent, WindowHeader } from 'react95';

import {
  Button,
  Frame,
  Hourglass,
  TextInput,
  Window,

} from "react95";
import styled, { keyframes } from 'styled-components';

type test = {
  id:number;
  name: string;
  description:string;
  value:number;
}

const hue = keyframes`
 from {
   -webkit-filter: hue-rotate(0deg);
 }
 to {
   -webkit-filter: hue-rotate(-360deg);
 }
`;

const AnimatedGradientText = styled.h1`
  margin:20;
  color: #f35626;
  background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 90px;
  font-weight: 700;
  line-height: 90px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;


function InventoryComponent() {
  // Use the useInventory hook to access the inventory data
  const [inventory] = useInventory();

  const [currDescription, setCurrDescription] = useState({name:"",value:0});

  function changeDescription(name, value) {
    setCurrDescription({name:name,value:value})
  }

  //fake stuff
  const inventory2: test[] = [{id:1,name:"arm",description:"a magica man", value:30},{id:2,name:"penny",description:"sick", value:3},
  {id:3,name:"penny",description:"the most prized coin in all of history", value:3},{id:0,name:"penny",description:"bappp", value:3}
  ,{id:0,name:"penny",description:"magic mmmm", value:3}
  ,{id:0,name:"penny",description:"your mom", value:3}
  ,{id:0,name:"penny",description:"the most prized coin in all of history", value:3}
  ,{id:0,name:"penny",description:"meep", value:3}
]
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
        
          <WindowContent>
          <ScrollView style={{  height: '400px' }}>
            {inventory2.map((item) => (
              <div
                className="flex flex-col items-center justify-center"
                key={item.id}
              >
                <motion.div
                  whileHover={{
                    opacity: 0.5,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <button>
                  <img
                    className="m-3"
                    onClick={() => changeDescription(item.name,item.value)}
                    src={imageUrl[item.id % 4]}
                    alt="Example Image"
                    width={50}
                    height={50}
                  />
                  </button>
                </motion.div>
                <div className="font-medium text-center">
                  {item.name.toUpperCase()}
                </div>
              </div>
            ))}
            </ScrollView>
            <AnimatedGradientText className="m-10 text-20xl">{currDescription.name.toUpperCase()}</AnimatedGradientText>          
            <div className="flex flex-col items-center justify-center m-4 text-7xl">${currDescription.value}</div>
          </WindowContent>
       
      </Window>
    </motion.div>
  </main>
</>
  );
}

export default InventoryComponent;







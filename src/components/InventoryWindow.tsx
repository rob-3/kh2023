import React from "react";
import useInventory from "../hooks/useInventory"; // Import the useInventory hook
import { motion } from "framer-motion";
import {
  Button,
  ScrollView,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import styled, { keyframes } from "styled-components";

type test = {
  id: number;
  name: string;
  description: string;
  value: number;
};

const hue = keyframes`
 from {
   -webkit-filter: hue-rotate(0deg);
 }
 to {
   -webkit-filter: hue-rotate(-360deg);
 }
`;

const AnimatedGradientText = styled.h1`
  margin: 20;
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

function InventoryComponent({ onClose }: { onClose: () => void }) {
  // Use the useInventory hook to access the inventory data
  const [inventory] = useInventory();

  return (
    <Window
      className={
        "h-full w-full max-w-4xl content-center !bg-zinc-900/70 backdrop-blur-md"
      }
    >
      <WindowHeader className={"flex select-none justify-between"}>
        <span>Inventory</span>
        <Button onClick={() => onClose()}>X</Button>
      </WindowHeader>

      <WindowContent>
        {Object.entries(inventory).length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center font-medium">No items :(</div>
          </div>
        ) : (
          <ScrollView className={"flex flex-wrap gap-4"}>
            {Object.entries(inventory).map(([name, amount]) => (
              <div
                className="flex flex-col items-center justify-center"
                key={name}
              >
                <motion.div
                  whileHover={{
                    opacity: 0.5,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/*<button>*/}
                  {/*  <Image*/}
                  {/*    className="m-3"*/}
                  {/*    src={imageUrl[item.id % 4]}*/}
                  {/*    alt="Example Image"*/}
                  {/*    width={50}*/}
                  {/*    height={50}*/}
                  {/*  />*/}
                  {/*</button>*/}
                </motion.div>
                <div className="text-center font-medium">
                  {name} x {amount}
                </div>
              </div>
            ))}
          </ScrollView>
        )}

        {/*{show === true && (*/}
        {/*  <div>*/}
        {/*    <AnimatedGradientText className="text-20xl m-10">*/}
        {/*      {currDescription.name.toUpperCase()}*/}
        {/*    </AnimatedGradientText>*/}
        {/*    <div className="m-4 flex flex-col items-center justify-center text-7xl">*/}
        {/*      ${currDescription.value}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </WindowContent>
    </Window>
  );
}

export default InventoryComponent;

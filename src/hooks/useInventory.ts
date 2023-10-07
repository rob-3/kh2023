import { useLocalStorage } from "usehooks-ts";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  value: number;
}

export default function useInventory() {
  return useLocalStorage<InventoryItem[]>("adventure-inventory", []);
}

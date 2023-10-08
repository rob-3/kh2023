import { useLocalStorage } from "usehooks-ts";

export default function useInventory() {
  return useLocalStorage<Record<string, number>>("adventure-inventory", {});
}

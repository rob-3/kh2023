import { useLocalStorage } from "usehooks-ts";

export default function useSavedCharacter() {
  return useLocalStorage<{
    name: string;
    story: string;
    situation: string;
    image: string;
    items: Record<string, number>;
  } | null>("adventure-character", null);
}

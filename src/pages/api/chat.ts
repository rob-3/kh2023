// ./app/api/chat/route.js
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const initialPrompt =
  "The following is a conversation of characters from the 1600s. Characters can trade and do other activities that " +
  "modify their inventory. They can deny trades if the gold offered is not enough. Each character must provide a response" +
  "and a character name with every interaction. Use JSON format" +
  "(gold is a placeholder but can be any item name with quantity and other items can be specified. The trade object is" +
  "only specified if a trade is finalized and both parties agree), " +
  'sample as follows: { "text": "", characterName: "", "trade": {"Gold": -20, "Treasure Map": 1} }';

export default async function handler(req: NextRequest) {
  let { messages } = (await req.json()) as {
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
  };
  messages = messages.map((message, idx) => {
    if (idx === 0) {
      return {
        ...message,
        content: initialPrompt + ". " + message.content,
      };
    }
    return message;
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.9,
    frequency_penalty: 1.0,
    presence_penalty: 0.5,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

// ./app/api/chat/route.js
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const initialPrompt =
  "The following is a conversation of characters from the 1600s. They should speak in first person without narration. " +
  "Characters can trade and do other activities that modify their inventory. They can deny trades if the gold offered is not enough. " +
  "Each character must provide a text response. characterName is always required. Use this JSON format " +
  "(The trade object is an example, any other item can be traded. The trade object is only specified if a trade is " +
  "finalized and both parties agree. text should always be a response string), " +
  'example as follows: { "text": "This is my offer", "characterName": "Thomas", "trade": {"gold": -20, "treasure map": 1} }. Conversation starts:';

export default async function handler(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
  };
  const newMessages = messages.slice(1).map((message, idx) => {
    if (idx === 0) {
      return {
        ...message,
        content: initialPrompt + ". " + message.content,
      };
    }

    return {
      ...message,
      content: message.content,
    };
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.9,
    frequency_penalty: 1.0,
    presence_penalty: 0.5,
    messages: newMessages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

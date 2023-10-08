// ./app/api/chat/route.js
import OpenAI from "openai";
import { type NextApiResponse } from "next";
import { type NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextRequest, res: NextApiResponse) {
  const { prompt } = (await req.json()) as { prompt: string };
  const response = await openai.images.generate({
    prompt,
    n: 1,
    size: "1024x1024",
  });
  return new Response(response.data[0]!.url);
}

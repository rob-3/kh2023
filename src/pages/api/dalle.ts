// ./app/api/chat/route.js
import OpenAI from "openai";
import { NextApiRequest, type NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = (req.body) as { prompt: string };
  const response = await openai.images.generate({
    prompt: `${prompt}`,
    n: 1,
    size: "256x256",
  });
  res.status(200).json({
    imageURL: response.data[0]!.url
  })
}

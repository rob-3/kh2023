// ./app/api/chat/route.js
import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = await req.body;
  const response = await openai.images.generate({
    prompt,
    n: 1,
    size: "1024x1024",
  })
  res.json({
    url: response.data[0]!.url
  })
}

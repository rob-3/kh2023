import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from "openai/index";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRouter = createTRPCRouter({
  story: publicProcedure
    .input(z.object({ story: z.string() }))
    .mutation(async ({ input }) => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              input.story +
              ".  Based on the 1600s pirate era, create a short 3 sentences situation this character is involved in at this moment. " +
              "For example, 'You are a pirate on a ship...' or 'Your life took an unfortunate turn when...' or others:",
          },
        ],
        temperature: 0.9,
        frequency_penalty: 1.0,
        presence_penalty: 0.5,
      });

      return response.choices[0]?.message.content;
    }),
});

import { z } from "zod";

export const createArticleSchema = z.object({
  userId: z.string(),
  title: z.string(),
  text: z.string(),
  image: z.any().optional(),
  tagNames: z.array(z.string()),
});

export type CreateArticleDto = z.infer<typeof createArticleSchema>;

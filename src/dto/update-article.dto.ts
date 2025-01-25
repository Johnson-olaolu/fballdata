import { z } from "zod";

export const updateArticleSchema = z.object({
  title: z.string(),
  text: z.string(),
  tagNames: z.array(z.string()),
});

export type UpdateArticleDto = z.infer<typeof updateArticleSchema>;

import { z } from "zod";

export const queryArticleSchema = z.object({
  userId: z.string().optional(),
  title: z.string().optional(),
  sortBy: z.string().optional(),
  orderBy: z.string().optional(),
  tagNames: z.array(z.string()),
});

export type QueryArticleDto = z.infer<typeof queryArticleSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginDto = z.infer<typeof loginSchema>;

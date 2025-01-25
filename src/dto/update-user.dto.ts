import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(2, "Username is required"),
});

export type UserSchema = z.infer<typeof updateUserSchema>;

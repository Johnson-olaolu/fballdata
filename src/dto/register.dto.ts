import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(2, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fullName: z.string().min(2, "Name is required"),
});

export type RegisterDto = z.infer<typeof registerSchema>;

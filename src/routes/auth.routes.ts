import { Router } from "express";
import { validate } from "../middleware/validationMiddleware";
import { registerSchema } from "../dto/register.dto";
import { loginSchema } from "../dto/login.dto";
import authController from "../controllers/auth.controller";
import { verifyEmailSchema } from "../dto/verify-email.dto";
import { forgotPasswordSchema } from "../dto/forgot-password.dto";

const authRouter = Router();

// Public routes
authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.get("/verify-email/send", validate(verifyEmailSchema), authController.sendVerifyEmail);
authRouter.get("/verify-email/confirm", authController.verifyEmail);
authRouter.post("/forgot-password/send", validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.get("/forgot-password/confirm", authController.resetPassword);

export default authRouter;

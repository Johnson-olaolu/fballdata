import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

// Public routes
authRouter.get("/register", authController.registerView);
authRouter.get("/login", authController.loginView);
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.get("/verify-email", authController.verifyMailView);
authRouter.get("/verify-email/send", authController.sendVerifyEmail);
authRouter.get("/verify-email/confirm", authController.verifyEmail);
authRouter.post("/forgot-password/send", authController.forgotPassword);
authRouter.get("/forgot-password/confirm", authController.resetPassword);

export default authRouter;

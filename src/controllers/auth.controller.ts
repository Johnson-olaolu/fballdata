import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.model";
import { JWT_ACCESS_TOKEN_SECRET, SITE_URL } from "../config";
import passport from "passport";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler";
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../services/mail.service";
import { registerSchema } from "../dto/register.dto";

class AuthController {
  public registerView = async (req: Request, res: Response) => {
    res.render("pages/auth/register", { error: null });
  };

  public register = expressAsyncHandler(async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.render("pages/auth/register", { error: JSON.stringify(result.error.message) });
      return;
    }
    const { email, password, fullName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.render("pages/auth/register", { error: "User Already exists" });
    }

    const user = await User.create({
      email,
      password,
      fullName,
    });

    const registrationToken = jwt.sign({ email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1h" });
    const verificationUrl = `${SITE_URL}/auth/verify-email/confirm?token=${registrationToken}`;
    sendWelcomeEmail(user, verificationUrl);
    res.redirect("/auth/verify-email");
  });

  public loginView = async (req: Request, res: Response) => {
    const { success, failure } = req.query;
    res.render("pages/auth/login", { error: failure || null, success: success || null });
  };

  public login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: User | false, info: { message: string }) => {
      try {
        if (err || !user) {
          res.render("pages/auth/login", { error: info.message, success: null });
          return;
        }
        req.login(user, { session: false }, async (error: Error | null) => {
          if (error) return next(error);
          const body = { id: user.id, email: user.email };
          let token = jwt.sign({ user: body }, JWT_ACCESS_TOKEN_SECRET ?? "");
          res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
          res.redirect("/dashboard");
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

  public verifyMailView = async (req: Request, res: Response) => {
    const { failure } = req.query;
    res.render("pages/auth/verify-email", { error: failure });
  };

  public sendVerifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    const user = await User.findOne({ where: { email } });
    // Check if user exists
    if (!user) {
      throw new AppError("User already exists", 400);
    }
    const registrationToken = jwt.sign({ email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1h" });
    const verificationUrl = `${SITE_URL}/auth/verify-email/confirm?token=${registrationToken}`;
    sendVerificationEmail(user, verificationUrl);

    res.json({ message: "Verification email sent" });
  });

  public verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
      throw new AppError("Invalid token", 400);
    }

    jwt.verify(token as string, JWT_ACCESS_TOKEN_SECRET ?? "", async (err, decoded) => {
      if (err) {
        res.redirect("/auth/login?failure=Invalid token");
      }

      const { email } = decoded as { email: string };
      const user = await User.update({ isVerified: true }, { where: { email } });
      if (!user) {
        res.redirect(`/auth/verify-email?email=${email}&failure=User not found for this email`);
      }
      res.redirect("/auth/login?success=Email verified successfully");
    });
  });

  public forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const resetToken = jwt.sign({ email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: "15m" });
    const resetUrl = `${process.env.SITE_URL}/auth/reset-password/confirm?token=${resetToken}`;
    sendResetPasswordEmail(user, resetUrl);

    res.json({ message: "Reset password email sent" });
  });

  public resetPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError("Invalid token or password", 400);
    }

    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET ?? "", async (err: any, decoded: any) => {
      if (err) {
        throw new AppError("Invalid token", 400);
      }

      const { email } = decoded as { email: string };
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.password = password;
      await user.save();

      res.json({ message: "Password reset successfully" });
    });
  });

  public logout = expressAsyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
  });
}

export default new AuthController();

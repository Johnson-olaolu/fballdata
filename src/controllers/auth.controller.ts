import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.model";
import { JWT_ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN, SITE_URL } from "../config";
import passport from "passport";
import jwt from "jsonwebtoken";
import { RegisterDto } from "../dto/register.dto";
import { AppError } from "../utils/errorHandler";
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../services/mail.service";
import { ResetPasswordDto } from "../dto/reset-password.dto";

class AuthController {
  public register = expressAsyncHandler(async (req: Request<{}, {}, RegisterDto>, res: Response) => {
    const { email, password, fullName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const user = await User.create({
      email,
      password,
      fullName,
    });

    const registrationToken = jwt.sign({ email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1h" });
    const verificationUrl = `${SITE_URL}/api/auth/verify-email/confirm?token=${registrationToken}`;
    sendWelcomeEmail(user, verificationUrl);
    res.status(201).json(this.signInUser(user));
  });

  public login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: User | false, info: { message: string }) => {
      try {
        if (err || !user) {
          const error = new Error(info.message);
          res.status(400);
          return next(error);
        }
        req.login(user, { session: false }, async (error: Error | null) => {
          if (error) return next(error);
          const body = { id: user.id, email: user.email };
          let token = jwt.sign({ user: body }, JWT_ACCESS_TOKEN_SECRET || "");
          return res.json({
            success: true,
            message: "User Logged in successfully",
            token: token,
            user: user,
          });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

  private readonly signInUser = (user: User) => {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: JWT_EXPIRES_IN as any });
    return {
      token,
      user,
    };
  };

  public sendVerifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("User already exists", 400);
    }
    const registrationToken = jwt.sign({ email: user.email }, JWT_ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1h" });
    const verificationUrl = `${process.env.SITE_URL}/api/auth/verify-email/confirm?token=${registrationToken}`;
    sendVerificationEmail(user.email, verificationUrl);

    res.json({ message: "Verification email sent" });
  });

  public verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
      throw new AppError("Invalid token", 400);
    }

    jwt.verify(token as string, JWT_ACCESS_TOKEN_SECRET ?? "", async (err, decoded) => {
      if (err) {
        throw new AppError("Invalid token", 400);
      }

      const { email } = decoded as { email: string };
      const user = await User.update({ isVerified: true }, { where: { email } });
      if (!user) {
        throw new AppError("User not found", 404);
      }
      res.json({ message: "Email verified successfully" });
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

  public resetPassword = expressAsyncHandler(async (req: Request<{}, {}, ResetPasswordDto>, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError("Invalid token or password", 400);
    }

    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET ?? "", async (err, decoded) => {
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
}

export default new AuthController();

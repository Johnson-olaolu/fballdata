import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.model";
import bcrypt from "bcrypt";
import { JWT_ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN, SITE_URL } from "../config";
import transporter from "../config/mailer.config";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import jwt from "jsonwebtoken";
import { RegisterDto } from "../dto/register.dto";
import { AppError } from "../utils/errorHandler";
import { sendWelcomeEmail } from "../services/mail.service";

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

    const registrationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
    const verificationUrl = `${SITE_URL}/api/auth/verify-email/confirm?token=${registrationToken}`;
    sendWelcomeEmail(user, verificationUrl);
    // res.status(201).json({

    //   token,
    // });
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
          let token = jwt.sign({ user: body }, process.env.JWT_SECRET || "");
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

  private signInUser = (user: User) => {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "", { expiresIn: JWT_EXPIRES_IN as any });
    return {
      token,
      user,
    };
  };
  // public login = async (req: Request, res: Response) => {
  //     try {
  //         const { email, password } = req.body;

  //         // Find user
  //         const user = await User.findOne({
  //             where: {
  //                 email,
  //             },
  //         });

  //         if (!user) {
  //             return res.status(401).json({
  //                 message: "Invalid credentials",
  //             });
  //         }

  //         // Check password
  //         const isPasswordValid = await bcrypt.compare(password, user.password);

  //         if (!isPasswordValid) {
  //             return res.status(401).json({
  //                 message: "Invalid credentials",
  //             });
  //         }

  //         if (!user.isVerified) {
  //             return res.status(401).json({
  //                 message: "Please verify your email first",
  //             });
  //         }

  //         // Generate JWT token
  //         const token = jwt.sign(
  //             {
  //                 id: user.id,
  //                 email: user.email,
  //                 role: user.role,
  //             },
  //             JWT_ACCESS_TOKEN_SECRET || "",
  //             {
  //                 expiresIn: "1d",
  //             }
  //         );

  //         return res.status(200).json({
  //             message: "Login successful",
  //             token,
  //             user: {
  //                 id: user.id,
  //                 fullName: user.fullName,
  //                 email: user.email,
  //                 userName: user.userName,
  //                 role: user.role,
  //             },
  //         });
  //     } catch (error) {
  //         console.error("Login error:", error);
  //         return res.status(500).json({
  //             message: "Internal server error",
  //         });
  //     }
  // };

  // public verifyEmail = async (req: Request, res: Response) => {
  //     try {
  //         const { token } = req.params;

  //         const user = await User.findOne({
  //             where: {
  //                 verifyEmailToken: token,
  //             },
  //         });

  //         if (!user) {
  //             return res.status(400).json({
  //                 message: "Invalid verification token",
  //             });
  //         }

  //         if (new Date(user.verifyEmailTokenTTL) < new Date()) {
  //             return res.status(400).json({
  //                 message: "Verification token has expired",
  //             });
  //         }

  //         await user.update({
  //             isVerified: true,
  //             verifyEmailToken: null,
  //             verifyEmailTokenTTL: null,
  //         });

  //         return res.status(200).json({
  //             message: "Email verified successfully",
  //         });
  //     } catch (error) {
  //         console.error("Email verification error:", error);
  //         return res.status(500).json({
  //             message: "Internal server error",
  //         });
  //     }
  // };

  // public forgotPassword = async (req: Request, res: Response) => {
  //     try {
  //         const { email } = req.body;

  //         const user = await User.findOne({
  //             where: {
  //                 email,
  //             },
  //         });

  //         if (!user) {
  //             return res.status(404).json({
  //                 message: "User not found",
  //             });
  //         }

  //         const resetToken = uuidv4();
  //         const resetTokenTTL = new Date(
  //             Date.now() + 1 * 60 * 60 * 1000
  //         ).toISOString(); // 1 hour from now

  //         await user.update({
  //             chnagePasswordToken: resetToken,
  //             chnagePasswordTokenTTL: resetTokenTTL,
  //         });

  //         await transporter.sendMail({
  //             from: process.env.EMAIL_USER,
  //             to: email,
  //             subject: "Reset your password",
  //             html: `Please click this link to reset your password: <a href="${process.env.BASE_URL}/auth/reset-password/${resetToken}">Reset Password</a>`,
  //         });

  //         return res.status(200).json({
  //             message: "Password reset email sent",
  //         });
  //     } catch (error) {
  //         console.error("Forgot password error:", error);
  //         return res.status(500).json({
  //             message: "Internal server error",
  //         });
  //     }
  // };
}

export default new AuthController();

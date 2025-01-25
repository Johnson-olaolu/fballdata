import transporter from "../config/mailer.config";
import { Options } from "nodemailer/lib/mailer";
import User from "../models/User.model";
import ejs from "ejs";
import path from "path";

type ExtendedOptions = Options & { template: string; context: Record<string, any> };

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email address",
      template: "verify-email",
      context: {
        verificationUrl,
      },
    } as ExtendedOptions,
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    }
  );
};

export const sendWelcomeEmail = async (user: User, verificationUrl: string) => {
  const htmlContent = await ejs.renderFile(path.resolve("../templates/email/welcome-email.ejs"), {
    username: user.userName,
    verificationUrl,
    linkExpiration: "15 minutes",
  });

  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Welcome to our platform",
      template: "welcome-email",
      html: htmlContent,
    } as ExtendedOptions,
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    }
  );
};

export const sendResetPasswordEmail = async (user: User, resetLink: string) => {
  const htmlContent = await ejs.renderFile(path.resolve("../templates/email/forgot-passsword.ejs"), {
    username: user.userName,
    resetLink,
    linkExpiration: "15 minutes",
  });

  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      template: "reset-password",
      html: htmlContent,
    } as ExtendedOptions,
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    }
  );
};

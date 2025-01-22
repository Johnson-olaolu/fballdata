import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import ejs from "ejs";
import { EMAIL_PASS, EMAIL_USER } from ".";

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// // Set up Handlebars options for Nodemailer
// transporter.use(
//   "compile",
//   ejs({
//     viewEngine: {
//       extname: ".ejs",
//       partialsDir: path.resolve("./"),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve("./templates/email/"),
//     extName: ".ejs",
//   })
// );

export default transporter;

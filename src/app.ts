import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import database from "./config/database.config";
import passport from "passport";
import initializePassport from "./services/strategy";
import logger from "./config/wiston.config";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));

// Passport Strategy
initializePassport(passport);
app.use(passport.initialize());

(async () => {
  await database.sync({ alter: true });
  logger.info("Database connected");
})();

// index page
registerRoutes(app);
export default app;

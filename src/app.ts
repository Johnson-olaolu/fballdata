import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import database from "./config/database.config";
import passport from "passport";
import { localStategy } from "./services/strategy/local.strategy";
import { jwtStrategy } from "./services/strategy/jwt.strategy";
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

// Passport Strategy
app.use(passport.initialize());
localStategy();
jwtStrategy();

(async () => {
  await database.sync({ force: true, alter: true });
  console.log("Database Connected");
})();

// index page
registerRoutes(app);

export default app;

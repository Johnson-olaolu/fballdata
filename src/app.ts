import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import database from "./config/database.config";
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

(async () => {
  await database.sync({ force: true, alter: true });
  console.log("Database Connected");
})();

// index page
registerRoutes(app);

export default app;

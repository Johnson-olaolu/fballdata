import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { initDatabase } from "./config/database.config";
const app = express();
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

initDatabase();
// index page
registerRoutes(app);

export default app;

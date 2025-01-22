import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
const app = express();
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// index page
registerRoutes(app);

export default app;

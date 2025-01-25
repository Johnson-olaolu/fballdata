import express from "express";
import IndexController from "../controllers";
import authRouter from "./auth.routes";
export const registerRoutes = (app: express.Application) => {
  app.get("/", IndexController.getName);
  app.use("/auth", authRouter);
};

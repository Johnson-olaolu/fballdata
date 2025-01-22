import express from "express";
import IndexController from "../controllers";
export const registerRoutes = (app: express.Application) => {
  app.get("/", IndexController.getName);
};

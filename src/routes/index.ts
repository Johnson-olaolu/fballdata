import express from "express";
import IndexController from "../controllers";
import authRouter from "./auth.routes";
import passport from "passport";
import User from "../models/User.model";
import dashboardRouter from "./dashboard.routes";
import isAuthenticated from "../middleware/authMiddleware";
import articleRouter from "./article.routes";
import unAuthenticated from "../middleware/unauthMiddleware";

export const registerRoutes = (app: express.Application) => {
  app.get("/", unAuthenticated, IndexController.getHome);
  app.get("/about", unAuthenticated, IndexController.getAbout);
  app.use("/auth", authRouter);
  app.use("/dashboard", isAuthenticated, dashboardRouter);
  app.use(
    "/article",
    (req, res, next) =>
      passport.authenticate("jwt", { session: true }, (err: any, user: User | false, info: { message: string }) => {
        try {
          if (err || !user) {
            next();
          } else {
            req.user = user;
            next();
          }
        } catch (error) {
          next(error);
        }
      })(req, res, next),
    articleRouter
  );
};

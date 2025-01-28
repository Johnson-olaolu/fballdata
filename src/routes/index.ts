import express from "express";
import IndexController from "../controllers";
import authRouter from "./auth.routes";
import passport from "passport";
import User from "../models/User.model";
export const registerRoutes = (app: express.Application) => {
  app.get(
    "/",
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
    IndexController.getName
  );
  app.use("/auth", authRouter);
};

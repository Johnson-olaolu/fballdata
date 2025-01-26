import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";

const isAuthenticated = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: true }, (err: any, user: User | false, info: { message: string }) => {
    try {
      if (err || !user) {
        res.status(401);
        res.redirect("/auth/login");
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

export default isAuthenticated;

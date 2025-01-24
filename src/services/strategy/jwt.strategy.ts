import passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import User from "../../models/User.model";

export const jwtStrategy = () =>
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_SECRET || "",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        const user = await User.findOne({ where: { email: token.user.email } });
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        return done(null, user);
      }
    )
  );

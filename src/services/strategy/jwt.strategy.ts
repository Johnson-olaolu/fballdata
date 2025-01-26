import passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import User from "../../models/User.model";
import { JWT_ACCESS_TOKEN_SECRET } from "../../config";
import { Request } from "express";

// Custom token extractor for cookies
const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.token || null;
};

export const jwtStrategy = (passport: passport.PassportStatic) =>
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: JWT_ACCESS_TOKEN_SECRET ?? "",
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
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

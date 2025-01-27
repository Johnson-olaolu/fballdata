import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/User.model";
import { Op } from "sequelize";

export const localStategy = (passport: passport.PassportStatic) =>
  passport.use(
    new LocalStrategy(async function (
      username: string,
      password: string,
      done: (error: any, user?: User | false, options?: { message: string }) => void
    ) {
      const user = await User.findOne({ where: { [Op.or]: [{ email: username }] } });
      if (!user) {
        return done(null, false, { message: "Invalid email  or password" });
      }
      if (!(await user.comparePassword(password))) {
        return done(null, false, { message: "Invalid email  or password" });
      }
      return done(null, user);
    })
  );

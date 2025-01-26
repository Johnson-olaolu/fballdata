import passport from "passport";
import userController from "../../controllers/user.controller";
import { localStategy } from "./local.strategy";
import { jwtStrategy } from "./jwt.strategy";

export default function initializePassport(passport: passport.PassportStatic) {
  // Define the authentication logic

  localStategy(passport);
  jwtStrategy(passport);
  // Serialize user into the session
  passport.serializeUser((user: any, done) => done(null, user.id));

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    // Here you would fetch the user from the database by ID
    const user = await userController.getUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}

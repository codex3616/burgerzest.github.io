import { Strategy as GoogleSrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/User.js";

export const connectPassport = () => {
  passport.use(
    new GoogleSrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLINET_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      //   login successfully and google gave few data like profile ,done and etc
      async function (accessToken, refreshToken, profile, done) {
        //   storing user in db...
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            photo: profile.photos[0].value,
          });

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // console.log(user);
    done(null, user.id);
    // done first argument is error and second argument is what to return...
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

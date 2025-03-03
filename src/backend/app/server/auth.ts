import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../db/models/User';
import { Express } from 'express';

export const registerAuth = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate('session'));

  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      (username, password, done) => {
        User.findOne({ username })
          .exec()
          .then((user) => {
            if (!user) {
              done(null, false, { message: 'Username or password mismatch.' });
              return;
            }

            // Validate password
            if (!user.validatePassword(password)) {
              done(null, false, { message: 'Username or password mismatch.' });
              return;
            }

            done(null, user);
          })
          .catch(() => {
            done(null, false, { message: 'Unknown error occurred while trying to authenticate.' });
          });
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    done(null, id as never);
  });
};

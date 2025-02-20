import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { app } from '../single';
import { User } from '../db/models/User';

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
            done(null, false);
            return;
          }

          // Validate password
          if (!user.validatePassword(password)) {
            done(null, false);
            return;
          }
          done(null, user);
        })
        .catch(() => {
          done(null, false);
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

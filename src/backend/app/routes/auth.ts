import passport from 'passport';
import { Route } from '../router';
import Joi from 'joi';
import { IUser, User } from '../db/models/User';
import { ResetPayload, SignupPayload } from '../../../shared/Payloads';
import { requireAuthenticated } from '../middleware/requireAuthentication';

export const register = (route: Route) => {
  route({
    handler: (req, res) => {
      const user = req.user as IUser;
      res.status(200).json({
        username: user.username,
        email: user.email,
        name: user.name,
      });
    },
    method: 'post',
    route: `/api/auth/login`,
    middleware: [passport.authenticate('local')],
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
  });

  route({
    handler: (req, res) => {
      req.logout((err) => {
        console.error(err);
      });
      res.status(200).json({ message: 'Logged out' });
    },
    method: 'post',
    middleware: [requireAuthenticated],
    route: `/api/auth/logout`,
  });

  route({
    handler: async (req, res) => {
      if (req.user) {
        res.status(403).json({ message: 'You are already authenticated. Logout first.' });
        return;
      }

      const payload = req.body as SignupPayload;

      if (payload.confirmPassword !== payload.password) {
        res.status(400).json({ message: 'Password mismatch.' });
      }

      const newUser = await User.create({
        username: payload.username,
        name: payload.name,
        password: payload.password,
        email: payload.email,
        securityQuestion: payload.securityQuestion,
        securityAnswer: payload.securityAnswer,
      });

      res.status(201).json({
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
      });
    },
    method: 'post',
    route: `/api/auth/signup`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        confirmPassword: Joi.ref('password'),
        securityQuestion: Joi.string().required(),
        securityAnswer: Joi.string().required(),
      })
        .with('password', 'confirmPassword')
        .with('securityQuestion', 'securityAnswer'),
    },
  });

  route({
    handler: async (req, res) => {
      const payload = req.body as ResetPayload;

      if (payload.confirmPassword !== payload.newPassword) {
        res.status(400).json({ message: 'Password mismatch.' });
      }

      const user = await User.findOne({ username: payload.username }).exec();

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      if (!user.validateAnswer(payload.securityAnswer)) {
        res.status(400).json({ message: 'Invalid answer' });
      }

      user.updateOne({ password: payload.newPassword });
      res.status(200).json({ message: 'Password successfully updated.' });
    },
    method: 'post',
    route: `/api/auth/reset`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.ref('password'),
        securityAnswer: Joi.string().required(),
      }).with('password', 'confirmPassword'),
    },
  });
};

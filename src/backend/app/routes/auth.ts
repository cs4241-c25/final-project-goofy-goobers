import passport from 'passport';
import { route } from '../router';
import Joi from 'joi';
import { User } from '../db/models/User';

route({
  handler: (req, res) => {
    res.status(200).json(req.user);
  },
  method: 'post',
  route: `/api/login`,
  middleware: [passport.authenticate('local')],
  validate: {
    payload: Joi.object({
      username: Joi.string(),
      password: Joi.string(),
    }),
  },
});

route({
  handler: (req) => {
    req.logout((err) => {
      console.error(err);
    });
  },
  method: 'post',
  route: `/api/logout`,
});

interface SignupPayload {
  username: string;
  name: string;
  password: string;
  email: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

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
  route: `/api/signup`,
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

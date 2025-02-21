import { RequestHandler } from 'express';

export const requireAuthentication: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  next();
};

import { RequestHandler } from 'express';

export const requireAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  next();
};

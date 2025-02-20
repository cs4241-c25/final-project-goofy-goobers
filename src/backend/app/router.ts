import { RequestHandler, Router } from 'express';
import { HTTPMethod } from '../../shared/HTTP';
import { Schema } from 'joi';
import { createValidator } from 'express-joi-validation';

interface Validator {
  query?: Schema;
  payload?: Schema;
}

export const router = Router();

const validator = createValidator();

router.route('/').get((_req, res) => {
  res.sendFile('index.html');
});

export const route = (attributes: {
  route: string;
  method: HTTPMethod;
  handler: RequestHandler;
  middleware?: RequestHandler[];
  validate?: Validator;
}) => {
  const { route, method, middleware, handler: initHandler, validate } = attributes;

  const handler: RequestHandler[] = [initHandler];

  if (middleware) {
    handler.push(...middleware);
  }

  if (validate) {
    handler.push(...getValidators(validate));
  }

  switch (method) {
    case 'delete':
      router.route(route).delete(handler);
      break;
    case 'get':
      router.route(route).get(handler);
      break;
    case 'head':
      router.route(route).head(handler);
      break;
    case 'patch':
      router.route(route).patch(handler);
      break;
    case 'post':
      router.route(route).post(handler);
      break;
    case 'put':
      router.route(route).put(handler);
      break;
  }
};

const getValidators = (validate: Validator): RequestHandler[] => {
  const handlers: RequestHandler[] = [];
  const { query, payload } = validate;

  if (query) {
    handlers.push(validator.query(query));
  }

  if (payload) {
    handlers.push(validator.body(payload));
  }

  return handlers;
};

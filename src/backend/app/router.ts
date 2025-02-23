import { RequestHandler, Router as ExpressRouter } from 'express';
import { HTTPMethod } from '../../shared/HTTP';
import { Schema } from 'joi';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { glob } from 'glob';
import path from 'path';

interface Validator {
  query?: Schema;
  payload?: Schema;
}

interface RouterOptions {
  route: string;
  method: HTTPMethod;
  handler: RequestHandler;
  middleware?: RequestHandler[];
  validate?: Validator;
}

export type Route = (opts: RouterOptions) => void;
type RouteRegister = (route: Route) => RouterOptions;
interface RouteModule {
  register: RouteRegister;
}

export const route = (
  opts: RouterOptions,
  router: ExpressRouter,
  validator: ExpressJoiInstance,
) => {
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

  const { route, method, middleware, handler: initHandler, validate } = opts;

  const handler: RequestHandler[] = [];

  if (validate) {
    handler.push(...getValidators(validate));
  }

  if (middleware) {
    handler.push(...middleware);
  }

  handler.push(initHandler);

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

export const registerRoutes = async (): Promise<ExpressRouter> => {
  const paths = await glob(path.join(__dirname, 'routes', '/**/!(index|*.test).js'), {
    windowsPathsNoEscape: true,
  });
  const router = ExpressRouter();
  const validator = createValidator();

  const superficialRouter = (options: RouterOptions): void => {
    route(options, router, validator);
  };

  for (const fileName of paths) {
    ((await import(fileName)) as RouteModule).register(superficialRouter);
  }

  return router;
};

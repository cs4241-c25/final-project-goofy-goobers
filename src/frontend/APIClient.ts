import { HTTPMethod } from '../shared/HTTP';
import { User } from '../shared/models/User';
import { ResetPayload, SignupPayload, WaypointPayload, LoginPayload } from '../shared/Payloads';
import { Path } from '../shared/models/Path';

interface RequestOptions<T> {
  url: string;
  method?: HTTPMethod;
  headers?: HeadersInit;
  payload?: T;
}

class RequestError extends Error {
  public override name = 'RequestError';
  public constructor(
    public readonly code: number,
    public readonly note?: string,
  ) {
    super(`Request failed with status code ${code}${note && ` : ${note}`}`);
  }
}

export class APIError extends RequestError {
  public override name = 'APIError';
  public constructor(
    public readonly code: number,
    public readonly body?: { message?: string },
  ) {
    super(code, body?.message);
  }
}

export class AuthenticationError extends RequestError {
  public override name = 'AuthenticationError';
  public constructor(public readonly code: number) {
    super(code);
  }
}

export class LoginError extends RequestError {
  public override name = 'LoginError';
  public constructor(public readonly code: number) {
    super(code);
  }
}

export class ServerError extends RequestError {
  public override name = 'ServerError';
  public constructor(public readonly code: number) {
    super(code);
  }
}

export class PermissionError extends RequestError {
  public override name = 'PermissionError';
  public constructor(public readonly message: string) {
    super(403, message);
  }
}

export class APIClient {
  public async reset(payload: ResetPayload) {
    await this.request({
      url: `/api/auth/reset`,
      method: `post`,
      payload,
    });
  }

  public async signup(payload: SignupPayload) {
    await this.request({
      url: `/api/auth/signup`,
      method: `post`,
      payload,
    });
  }

  public async authenticate(payload: LoginPayload) {
    return await this.request<User>({
      url: `/api/auth/login`,
      method: 'post',
      payload,
    });
  }

  public async logout() {
    await this.request({
      url: `/api/auth/logout`,
      method: 'post',
    });
  }

  public async createPath(name: string, description?: string) {
    return await this.request<Path>({
      url: `/api/path`,
      method: 'post',
      payload: {
        name,
        description,
      },
    });
  }

  public async deletePath(pathId: string) {
    await this.request({
      url: `/api/path/${pathId}/`,
      method: 'delete',
      payload: {
        pathId,
      },
    });
  }

  public async createWaypoint(pathId: string, payload: WaypointPayload) {
    return await this.request<Path>({
      url: `/api/path/${pathId}/waypoint`,
      method: 'post',
      payload: {
        name: payload.name,
        description: payload.description,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
    });
  }

  public async deleteWaypoint(pathId: string, waypointId: string) {
    return await this.request<Path>({
      url: `/api/path/${pathId}/waypoint/${waypointId}`,
      method: 'delete',
      payload: {
        pathId,
        waypointId,
      },
    });
  }

  public async editWaypoint(pathId: string, waypointId: string, waypoint: WaypointPayload) {
    await this.request({
      url: `/api/path/${pathId}/waypoint/${waypointId}`,
      method: 'post',
      payload: waypoint,
    });
  }

  public async getAllPaths() {
    return await this.request<Path[]>(`/api/paths/all`);
  }

  public async getPath(pathId?: string) {
    return await this.request<Path>(`/api/path/${pathId}`);
  }

  public async poll() {
    return await this.request<User>(`/api/profile/current`);
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  public async request<T extends object | void = void>(
    opts: RequestOptions<object | undefined> | string,
  ): Promise<T> {
    opts = typeof opts === 'object' ? opts : { url: opts };

    const { payload, url, headers: initialHeaders = {}, method = 'get' } = opts;

    const headers = new Headers(initialHeaders);

    if (payload) {
      headers.append('Content-Type', 'application/json; charset=utf-8');
    }

    const response = await fetch(url, {
      body: payload ? JSON.stringify(payload) : undefined,
      headers,
      method: method.toUpperCase(),
    });

    const { status } = response;
    const body = await response.text();

    let parsedResponse: unknown;

    try {
      if (body !== '') {
        parsedResponse = JSON.parse(body, restoreDate) as unknown;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        if (isOK(body, status)) {
          return {
            status: 'OK',
          } as T;
        }

        if (permissionError(status)) {
          throw new PermissionError("You don't have permission to do that.");
        }

        if (url === '/api/auth/login' && isAuthenticationError(body, status)) {
          throw new LoginError(status);
        }

        if (isAuthenticationError(body, status)) {
          throw new AuthenticationError(status);
        }

        if (isInternalServerError(body, status)) {
          throw new ServerError(status);
        }
      }

      if (error instanceof SyntaxError && isInternalServerError(body, status)) {
        throw new ServerError(status);
      }

      throw error;
    }

    if (status >= 200 && status <= 299) {
      return parsedResponse as T;
    }

    if (status >= 400 && status <= 499) {
      if (permissionError(status)) {
        // to everyone else: never do this.
        const msg = (body as unknown as { error: string }).error;
        throw new PermissionError(msg);
      }

      throw new APIError(status, parsedResponse as object);
    }

    if (status >= 500 && status <= 500) {
      throw new ServerError(status);
    }

    throw new RequestError(status);
  }
}

// fix json dates

const isoDateMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const restoreDate = (_key: string, value: unknown) => {
  if (typeof value === 'string' && isoDateMatch.test(value)) {
    return new Date(value);
  }

  return value;
};

const isAuthenticationError = (body: string, status: number) => {
  if (status === 401 && body === 'Unauthorized') {
    return true;
  }

  return false;
};

const permissionError = (status: number) => {
  return status === 403;
};

const isInternalServerError = (body: string, status: number) => {
  if (status >= 500 && status <= 599 && body.startsWith('Error')) {
    return true;
  }

  return false;
};

const isOK = (body: string, status: number) => {
  if (status >= 200 && status <= 299 && body.startsWith('OK')) {
    return true;
  }

  return false;
};

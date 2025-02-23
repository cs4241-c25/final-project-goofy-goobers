import { HTTPMethod } from '../shared/HTTP';
import { User } from '../shared/models/User';
import { ResetPayload, SignupPayload } from '../shared/Payloads';

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

export class ServerError extends RequestError {
  public override name = 'ServerError';
  public constructor(public readonly code: number) {
    super(code);
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

  public async authenticate(username: string, password: string) {
    return await this.request<User>({
      url: `/api/auth/login`,
      method: 'post',
      payload: {
        username,
        password,
      },
    });
  }

  public async logout() {
    await this.request({
      url: `/api/auth/logout`,
      method: 'post',
    });
  }

  public async poll() {
    return await this.request<User>(`/api/user/current`);
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
      if (error instanceof SyntaxError && isAuthenticationError(body, status)) {
        throw new AuthenticationError(status);
      }

      throw error;
    }

    if (status >= 200 && status <= 299) {
      return parsedResponse as T;
    }

    if (status >= 400 && status <= 499) {
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

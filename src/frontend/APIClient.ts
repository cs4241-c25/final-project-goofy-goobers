import { ResetPayload, SignupPayload } from '../shared/Auth';
import { HTTPMethod } from '../shared/HTTP';
import { User } from '../shared/models/User';

interface RequestOptions<T> {
  url: string;
  method?: HTTPMethod;
  headers?: HeadersInit;
  payload?: T;
}

class RequestError extends Error {
  public override name = 'RequestError';
  public constructor(public readonly code: number) {
    super(`Request failed with status code ${code}`);
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

    if (body !== '') {
      parsedResponse = JSON.parse(body, restoreDate) as unknown;
    }

    if (status >= 200 && status <= 299) {
      return parsedResponse as T;
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

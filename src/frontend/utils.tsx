import { toast } from 'react-toastify';
import {
  APIError,
  AuthenticationError,
  LoginError,
  PermissionError,
  ServerError,
} from './APIClient';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export const captureError = (err: unknown) => {
  const error = err as Error;
  let { message } = error;
  if (error instanceof AuthenticationError) {
    message = 'You are not authenticated.';
  }
  if (error instanceof ServerError) {
    message = 'An internal server error occurred.';
  }
  if (error instanceof LoginError) {
    message = 'Username or password mismatch.';
  }
  if (error instanceof APIError) {
    message = `${error.code}: ${error.message}`;
  }
  if (error instanceof PermissionError) {
    message = `You do not have permission to do that.`;
  }
  toast.error(message);
};

export function useObjectState<T extends object>(
  initialState: T,
): [T, (key: keyof T, value: T[keyof T]) => void, Dispatch<SetStateAction<T>>] {
  const [object, setObject] = useState<T>(initialState);

  const dispatch = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      setObject({
        ...object,
        [key]: value,
      });
    },
    [object, setObject],
  );

  return [object, dispatch, setObject];
}

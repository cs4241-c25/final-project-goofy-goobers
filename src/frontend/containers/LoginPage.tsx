import React, { FC, useCallback, useContext } from 'react';
import { Button } from 'reactstrap';
import { UserContext, useUser } from '../services/providers';

export const LoginPage: FC = () => {
  const { setUser } = useContext(UserContext);
  const user = useUser();

  const authenticate = useCallback(async () => {
    const attempt = await api.authenticate('gompei', 'salisbury');

    setUser(attempt);
  }, [setUser]);

  return (
    <>
      <Button
        onClick={() => {
          void authenticate();
        }}
      >
        Login
      </Button>
      {user && <p>You are authenticated as {user.username}</p>}
    </>
  );
};

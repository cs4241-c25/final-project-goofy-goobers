import React, { FC, useCallback, useContext } from 'react';
import { Button } from 'reactstrap';
import { UserContext } from '../services/providers';
import { redirect } from 'react-router-dom';
import { AuthenticationError } from '../APIClient';
import { toast } from 'react-toastify';

export const LoginPage: FC = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = useCallback(() => {
    api
      .authenticate('gompei', 'salisbury')
      .then((usr) => {
        setUser(usr);
        toast.success(`Logged in succesfully as ${usr.username}`);
        redirect('/');
      })
      .catch((err: unknown) => {
        if (err instanceof AuthenticationError) {
          toast.error('Login failed.');
          console.error('Login failed');
          return;
        }
        throw err;
      });
  }, [setUser]);

  return (
    <>
      <Button onClick={handleLogin}>Login</Button>
    </>
  );
};

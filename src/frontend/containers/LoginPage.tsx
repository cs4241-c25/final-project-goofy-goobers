import React, { FC, useCallback, useContext } from 'react';
import { Button } from 'reactstrap';
import { UserContext } from '../services/providers';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { captureError } from '../utils';

export const LoginPage: FC = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = useCallback(() => {
    api
      .authenticate('dblatner', '123')
      .then((usr) => {
        setUser(usr);
        toast.success(`Logged in succesfully as ${usr.username}`);
        redirect('/');
      })
      .catch(captureError);
  }, [setUser]);

  return (
    <Button
      onClick={() => {
        handleLogin();
      }}
    >
      Login
    </Button>
  );
};

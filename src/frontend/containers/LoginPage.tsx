import React, { FC, useCallback, useContext } from 'react';
import { UserContext } from '../services/providers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { captureError } from '../utils';
import { LoginPayload } from '../../shared/Payloads';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = useCallback(
    (payload: LoginPayload) => {
      api
        .authenticate(payload)
        .then(async (usr) => {
          setUser(usr);
          toast.success(`Logged in succesfully as ${usr.username}`);
          await navigate('/');
        })
        .catch(captureError);
    },
    [setUser, navigate],
  );

  return (
    <>
      <h1>Log In</h1>
      <LoginForm submit={handleLogin} />
    </>
  );
};

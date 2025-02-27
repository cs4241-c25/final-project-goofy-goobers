import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../components/SignupForm';
import { captureError } from '../utils';
import { SignupPayload } from '../../shared/Payloads';

export const SignupPage: FC = () => {
  const navigate = useNavigate();

  const handleSignup = (payload: SignupPayload) => {
    api
      .signup(payload)
      .then(async () => {
        await navigate('/login');
      })
      .catch(captureError);
  };

  return (
    <>
      <h1>Sign Up</h1>
      <SignupForm submit={handleSignup} />
    </>
  );
};

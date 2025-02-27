import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../components/SignupForm';
import { captureError } from '../utils';
import { SignupPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';

export const SignupPage: FC = () => {
  const navigate = useNavigate();

  const handleSignup = useCallback(
    (payload: SignupPayload) => {
      api
        .signup(payload)
        .then(async () => {
          toast.success(`Signup Successful`);
          await navigate('/login');
        })
        .catch(captureError);
    },
    [navigate],
  );

  return (
    <>
      <h1>Sign Up</h1>
      <SignupForm submit={handleSignup} />
    </>
  );
};

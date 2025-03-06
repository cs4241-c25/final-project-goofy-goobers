import React, { FC, useCallback } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useObjectState } from '../utils';
import { LoginPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';

interface LoginFormProps {
  submit: (payload: LoginPayload) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ submit }) => {
  const [form, setForm] = useObjectState<LoginPayload>({
    username: '',
    password: '',
  });

  const handleSubmission = useCallback(() => {
    let failed = false;
    if (!form.username) {
      failed = true;
      toast.error('Please provide your username.');
    }

    if (!form.password) {
      failed = true;
      toast.error('Please provide your password.');
    }

    if (failed) {
      return;
    }

    submit(form);
  }, [submit, form]);

  return (
    <Form>
      <FormGroup>
        <Label for="username">Username: </Label>
        <Input
          type="text"
          id="username"
          value={form.username}
          name="username"
          placeholder="Enter Username"
          required
          onChange={(e) => {
            setForm('username', e.target.value);
          }}
        />
        <br />
        <Label for="password">Password: </Label>
        <Input
          type="password"
          id="password"
          value={form.password}
          name="password"
          placeholder="Enter Password"
          required
          onChange={(e) => {
            setForm('password', e.target.value);
          }}
        />
        <br />
        <Button
          color="success"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmission();
          }}
        >
          Log In
        </Button>
      </FormGroup>
    </Form>
  );
};

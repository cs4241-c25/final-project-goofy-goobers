import React, { FC, useCallback } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useObjectState } from '../utils';
import { SignupPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';

interface SignupFormProps {
  submit: (payload: SignupPayload) => void;
}

export const SignupForm: FC<SignupFormProps> = ({ submit }) => {
  const [form, setForm] = useObjectState<SignupPayload>({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const handleSubmission = useCallback(() => {
    if (form.password !== form.confirmPassword) {
      toast.error(`Signup Failed: Your passwords don't match`);
      return;
    }

    if (
      !form.confirmPassword ||
      !form.username ||
      !form.name ||
      !form.password ||
      !form.confirmPassword ||
      !form.email ||
      !form.securityAnswer ||
      !form.securityQuestion
    ) {
      toast.error('Signup Failed: Please complete all fields.');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info)$/.test(form.email)) {
      toast.error(`Signup Failed: You need a valid email`);
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
        <Label for="name">Name: </Label>
        <Input
          type="text"
          id="name"
          value={form.name}
          name="name"
          placeholder="Enter Full Name"
          required
          onChange={(e) => {
            setForm('name', e.target.value);
          }}
        />
        <br />
        <Label for="email">Email: </Label>
        <Input
          type="email"
          id="email"
          value={form.email}
          name="email"
          placeholder="Enter Email"
          required
          onChange={(e) => {
            setForm('email', e.target.value);
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
        <Label for="confirmPassword">Confirm Password: </Label>
        <Input
          type="password"
          id="confirmPassword"
          value={form.confirmPassword}
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={(e) => {
            setForm('confirmPassword', e.target.value);
          }}
        />
        <br />
        <Label for="securityQuestion">Security Question: </Label>
        <Input
          type="text"
          id="securityQuestion"
          value={form.securityQuestion}
          name="securityQuestion"
          placeholder="Enter Security Question"
          required
          onChange={(e) => {
            setForm('securityQuestion', e.target.value);
          }}
        />
        <br />
        <Label for="securityAnswer">Security Answer: </Label>
        <Input
          type="text"
          id="securityAnswer"
          value={form.securityAnswer}
          name="securityAnswer"
          placeholder="Enter Security Answer"
          required
          onChange={(e) => {
            setForm('securityAnswer', e.target.value);
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
          Sign Up
        </Button>
      </FormGroup>
    </Form>
  );
};

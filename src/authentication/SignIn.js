import React from 'react';
import { Auth, JS } from 'aws-amplify';
import { AuthState } from './AuthState';
import { ChallengeName } from './ChallengeName';
import { Button, Error, Form, Input, Label } from '../components';

const validAuthStates = [
  AuthState.signIn,
  AuthState.signedOut,
  AuthState.signedUp,
];

export function SignIn(props) {
  const [form, setForm] = React.useState({
    username: '',
    password: '',
    errorMessage: '',
  });

  function handleChange(e) {
    const {
      currentTarget: { name, value },
    } = e;

    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setForm({
      ...form,
      errorMessage: '',
    });

    const { username, password } = form;

    Auth.signIn(username, password)
      .then(user => {
        if (user.challengeName === ChallengeName.MFA_SETUP) {
          props.onStateChange(AuthState.TOTPSetup, user);
        }

        if (
          user.challengeName === ChallengeName.SOFTWARE_TOKEN_MFA ||
          user.challengeName === ChallengeName.SMS_MFA
        ) {
          props.onStateChange(AuthState.confirmSignIn, user);
        }

        if (user.challengeName === ChallengeName.NEW_PASSWORD_REQUIRED) {
          props.onStateChange(AuthState.requireNewPassword, user);
        }

        if (!user.challengeName) {
          // If MFA isn't required , this does one final check to see if User needs to verify email/phone.
          Auth.verifiedContact(user).then(data => {
            // User has a verified form of communication, skip.
            if (!JS.isEmpty(data.verified)) {
              props.onStateChange(AuthState.signedIn, {
                ...user,
                ...data,
              });
            } else {
              // Give user opportunity to verify email/phone.
              props.onStateChange(AuthState.verifyContact, {
                ...user,
                ...data,
              });
            }
          });
        }
      })
      .catch(err => {
        // TODO: errors
        //  "Password reset required for the user" when User uses an old password after Admin has reset it via User Pool.

        setForm({
          ...form,
          errorMessage: err.message,
        });
      });
  }

  function resetPassword() {
    props.onStateChange(AuthState.forgotPassword);
  }

  return validAuthStates.includes(props.authState) ? (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label>Username</Label>
        <br />
        <Input name='username' onChange={handleChange} autoFocus />
      </div>
      <div>
        <Label>Password</Label>
        <br />
        <Input name='password' type='password' onChange={handleChange} />
      </div>
      {form.errorMessage && <Error>{form.errorMessage}</Error>}
      <div>
        <Button>Sign In</Button>
      </div>
      <div>
        <Button onClick={resetPassword}>Forgot Password</Button>
      </div>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </Form>
  ) : null;
}

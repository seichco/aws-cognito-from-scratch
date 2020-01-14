import React from 'react';
import { Auth, JS } from 'aws-amplify';
import { AuthState } from './AuthState';
import { ChallengeName } from './ChallengeName';
import { Button, Error, Form, Input, Label } from '../components';

const validAuthStates = [AuthState.confirmSignIn];

export function ConfirmTotp(props) {
  const [form, setForm] = React.useState({ totp: '' });

  function handleInputChange(e) {
    const {
      currentTarget: { name, value },
    } = e;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const user = props.authData;

    Auth.confirmSignIn(user, form.totp, ChallengeName.SOFTWARE_TOKEN_MFA)
      .then(confirmedUser => {
        // Checks to see if User needs to verify email/phone.
        Auth.verifiedContact(confirmedUser).then(data => {
          // User has a verified form of communication, skip.
          if (!JS.isEmpty(data.verified)) {
            props.onStateChange(AuthState.signedIn, {
              ...confirmedUser,
              ...data,
            });
          } else {
            // Give user opportunity to verify email/phone.
            props.onStateChange(AuthState.verifyContact, {
              ...confirmedUser,
              ...data,
            });
          }
        });
      })
      .catch(err => {
        // TODO: Fix error messaging:
        //  "Invalid code received for user" when using bad TOTP.
        //  "Confirmation code cannot be empty" when no code.
        //  "Invalid session for the user, session is expired" when entering a code after an extended period of time.
        //  "Code mismatch and fail enable Software Token MFA" when using old QR setup on newly re-created user.
        setForm({
          ...form,
          errorMessage: err.message,
        });
      });
  }

  return validAuthStates.includes(props.authState) ? (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label>The One-Time Password</Label>
      </div>
      <div>
        <Input name='totp' onChange={handleInputChange} autoFocus />
      </div>
      {form.errorMessage && <Error>{form.errorMessage}</Error>}
      <div>
        <Button>Verify</Button>
      </div>
      <pre>{JSON.stringify({ form, props }, null, 2)}</pre>
    </Form>
  ) : null;
}

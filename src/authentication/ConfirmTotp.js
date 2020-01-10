import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button, Label, Input } from '../components/forms';

const validStates = [AuthState.confirmSignIn];

export function ConfirmTotp(props) {
  console.info('totp start', { props });
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

    Auth.confirmSignIn(user, form.totp, 'SOFTWARE_TOKEN_MFA').then(() => {
      // TODO: Check for verifying contact info
      // and then...
      props.onStateChange(AuthState.signedIn, user);
    });
  }

  return validStates.includes(props.authState) ? (
    <form onSubmit={handleSubmit}>
      <div>
        <Label>The One-Time Password</Label>
      </div>
      <div>
        <Input name='totp' onChange={handleInputChange} autoFocus />
      </div>
      <div>
        <Button>Verify</Button>
      </div>
      <pre>{JSON.stringify({ form, props }, null, 2)}</pre>
    </form>
  ) : null;
}

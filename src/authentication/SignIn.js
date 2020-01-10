import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Input, Button, Label } from '../components/forms';

const validAuthStates = [AuthState.signIn];

export function SignIn(props) {
  const [form, setForm] = React.useState({ username: '', password: '' });

  function handleChange(e) {
    const {
      currentTarget: { name, value },
    } = e;

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { username, password } = form;

    Auth.signIn(username, password)
      .then(user => {
        console.log('signIn response', { user });
        if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          props.onStateChange(AuthState.confirmSignIn, user);
        }
      })
      .catch(console.info);
  }

  return validAuthStates.includes(props.authState) ? (
    <form onSubmit={handleSubmit}>
      {console.log({ props })}
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
      <div>
        <Button>Sign In</Button>
      </div>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </form>
  ) : null;
}

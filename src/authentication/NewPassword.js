import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { ChallengeName } from './ChallengeName';
import { Button, Form, Input, Label } from '../components';

const validAuthStates = [AuthState.requireNewPassword];

export function NewPassword(props) {
  const [formValues, setFormValues] = React.useState({ password: '' });

  function handleSubmit(e) {
    e.preventDefault();

    const user = props.authData;
    const { password } = formValues;

    Auth.completeNewPassword(user, password) // attributes?
      .then(user => {
        if (user.challengeName === ChallengeName.SOFTWARE_TOKEN_MFA) {
          props.onStateChange(AuthState.confirmSignIn, user);
        }

        if (user.challengeName === ChallengeName.MFA_SETUP) {
          props.onStateChange(AuthState.TOTPSetup, user);
        }
      })
      .catch(console.info);
  }

  function handleInputChange(e) {
    const {
      currentTarget: { name, value },
    } = e;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  return validAuthStates.includes(props.authState) ? (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label>Change Password</Label>
      </div>
      <div>
        <Input
          name='password'
          type='password'
          onChange={handleInputChange}
          autoFocus
        />
      </div>
      <div>
        <Button>Change</Button>
      </div>
    </Form>
  ) : null;
}

import React from 'react';
import { Auth, JS } from 'aws-amplify';
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

        // No challengeName, forwarded to signedIn because MFA not required
        if (!user.challengeName) {
          // Checks to see if User needs to verify email/phone.
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
          props.onStateChange(AuthState.signedIn, user);
        }
      })
      .catch(err => {
        // TODO: err
        console.info('Submit new password error', { err });
      });
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

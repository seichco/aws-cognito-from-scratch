import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from '../authentication/AuthState';

const validAuthStates = [AuthState.signedIn];

export function Protected(props) {
  return validAuthStates.includes(props.authState) ? (
    <h1>You made it!</h1>
  ) : null;
}

import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button } from '../components';

const validAuthStates = [AuthState.signedIn];

export function SignOut(props) {
  async function handleClick() {
    await Auth.signOut();
  }
  return validAuthStates.includes(props.authState) ? (
    <Button onClick={handleClick}>Sign Out</Button>
  ) : null;
}

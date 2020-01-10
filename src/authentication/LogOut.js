import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button } from '../components/forms';

const invalidAuthStates = ['signIn'];

export function LogOut(props) {
  async function handleClick() {
    await Auth.signOut();
  }
  return !invalidAuthStates.includes(props.authState) ? (
    <Button onClick={handleClick}>Log Out</Button>
  ) : null;
}

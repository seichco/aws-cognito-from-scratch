import React from 'react';
import { Button } from '../components';
import { useAuthUser } from '../useAuthUser';
import { AuthState } from './AuthState';

const validAuthStates = [AuthState.signedIn];

export function SignOut(props) {
  const { logout } = useAuthUser();

  function handleClick() {
    logout();
  }

  return validAuthStates.includes(props.authState) ? (
    <Button onClick={handleClick}>Sign Out</Button>
  ) : null;
}

import React from 'react';
import { AuthState } from './AuthState';
import { Spinner } from '../components';

const validAuthStates = [AuthState.loading];

export function Loading(props) {
  return validAuthStates.includes(props.authSate) ? <Spinner /> : null;
}

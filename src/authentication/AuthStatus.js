import React from 'react';

export function AuthStatus(props) {
  const { authState, authData } = props;
  return <pre>{JSON.stringify({ authState, authData }, null, 2)}</pre>;
}

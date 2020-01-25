import React from 'react';
import { UserContext } from './AuthUser';

export function useAuthUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('`useUser` must be within `UserProvider`');
  }

  return context;
}

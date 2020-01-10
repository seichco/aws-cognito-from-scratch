import React from 'react';
import { Authenticator } from 'aws-amplify-react';
import './App.css';
import { SignIn } from './authentication/SignIn';
import { ConfirmTotp } from './authentication/ConfirmTotp';
import { LogOut } from './authentication/LogOut';
import { AuthStatus } from './authentication/AuthStatus';

function App() {
  return (
    <Authenticator hideDefault>
      <SignIn />
      <LogOut />
      <ConfirmTotp />
      <AuthStatus />
    </Authenticator>
  );
}

export default App;

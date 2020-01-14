import { Authenticator } from 'aws-amplify-react';
import React from 'react';
import './App.css';
import { AuthStatus } from './authentication/AuthStatus';
import { ConfirmTotp } from './authentication/ConfirmTotp';
import { ForgotPassword } from './authentication/ForgotPassword';
import { Loading } from './authentication/Loading';
import { NewPassword } from './authentication/NewPassword';
import { SetupTotp } from './authentication/SetupTotp';
import { SignIn } from './authentication/SignIn';
import { SignOut } from './authentication/SignOut';
import { StatePicker } from './authentication/StatePicker';
import { VerifyContact } from './authentication/VerifyContact';

function App() {
  return (
    <Authenticator hideDefault>
      <StatePicker />
      <Loading />
      <SignIn />
      <ForgotPassword />
      <NewPassword />
      <SetupTotp />
      <ConfirmTotp />
      <VerifyContact />
      <SignOut />
      <AuthStatus />
    </Authenticator>
  );
}

export default App;

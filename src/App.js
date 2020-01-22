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
import { ToggleMfa } from './authentication/ToggleMfa';
import { VerifyContact } from './authentication/VerifyContact';
import { Protected } from './pages/Protected';

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
      <Protected />
      <SignOut />
      <ToggleMfa />
      <AuthStatus />
    </Authenticator>
  );
}

export default App;

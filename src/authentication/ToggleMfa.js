import React from 'react';
import { Auth } from 'aws-amplify';
import { Button } from '../components';
import { AuthState } from './AuthState';

const validAuthStates = [AuthState.signedIn];
const mfaType = {
  NOMFA: 'NOMFA',
  TOTP: 'TOTP',
  SOFTWARE_TOKEN_MFA: 'SOFTWARE_TOKEN_MFA',
};
const buttonTextState = {
  [mfaType.NOMFA]: 'Set MFA',
  [mfaType.SOFTWARE_TOKEN_MFA]: 'Remove MFA',
  [mfaType.TOTP]: 'Remove MFA',
};

export function ToggleMfa(props) {
  const [preferredMfa, setPreferredMfa] = React.useState();
  const [buttonText, setButtonText] = React.useState('Getting MFA Status');

  React.useEffect(() => {
    if (props.authData) {
      if (props.authData.preferredMFA) {
        setButtonText(buttonTextState[props.authData.preferredMFA]);
        setPreferredMfa(props.authData.preferredMFA);
      } else {
        Auth.currentAuthenticatedUser().then(user => {
          setButtonText(buttonTextState[user.preferredMFA]);
          setPreferredMfa(user.preferredMFA);
        });
      }
    }
  }, [props.authData]);

  async function handleClick() {
    setButtonText('Updating MFA');
    Auth.currentAuthenticatedUser().then(user => {
      const newPreferredMfa =
        user.preferredMFA === mfaType.NOMFA ? mfaType.TOTP : mfaType.NOMFA;
      Auth.setPreferredMFA(user, newPreferredMfa)
        .then(() => {
          setPreferredMfa(newPreferredMfa);
          setButtonText(buttonTextState[newPreferredMfa]);
        })
        .catch(err => {
          // TODO! error
          console.error('error setting preferred mfa', err);
        });
    });
  }

  return (
    validAuthStates.includes(props.authState) && (
      <Button onClick={handleClick}>{buttonText}</Button>
    )
  );
}

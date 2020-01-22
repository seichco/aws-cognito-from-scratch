import React from 'react';
import QrCode from 'qrcode.react';
import { Auth, JS } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button, Form, Input, Label } from '../components';

const validAuthStates = [AuthState.TOTPSetup];

function checkUserContact(user, props) {
  Auth.verifiedContact(user).then(data => {
    if (!JS.isEmpty(data.verified)) {
      props.onStateChange(AuthState.signedIn, user);
    } else {
      props.onStateChange(AuthState.verifyContact, { ...user, ...data });
    }
  });
}

export function SetupTotp(props) {
  const [form, setForm] = React.useState({ challengeAnswer: '' });
  const isVisible = validAuthStates.includes(props.authState);
  const user = props.authData;

  function handleSubmit(e) {
    e.preventDefault();

    Auth.verifyTotpToken(user, form.challengeAnswer).then(response => {
      Auth.setPreferredMFA(user, 'TOTP').then(_ => {
        checkUserContact(user, props);
      });
    });
  }

  function handleInputChange(e) {
    const {
      currentTarget: { name, value },
    } = e;

    setForm({ ...form, [name]: value });
  }

  function handleSkip(e) {
    e.preventDefault();
    checkUserContact(user, props);
  }

  return isVisible ? (
    <>
      <QrGenerator user={user} />
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Code</Label>
        </div>
        <div>
          <Input
            name='challengeAnswer'
            onChange={handleInputChange}
            autoFocus
          />
        </div>
        <div>
          <Button>Verify</Button>
        </div>
        <div>
          <Button onClick={handleSkip}>Skip</Button>
        </div>
      </Form>
    </>
  ) : null;
}

function QrGenerator(props) {
  const { user } = props;
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    Auth.setupTOTP(user).then(secretCode => {
      const issuer = 'AWSCognito';
      const qrValue = `otpauth://totp/${issuer}:${user.username}?secret=${secretCode}&issuer=${issuer}`;
      setValue(qrValue);
    });
  }, [user]);
  return <QrCode value={value} />;
}

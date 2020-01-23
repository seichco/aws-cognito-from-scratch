import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button, Form, Input, Label } from '../components';

/**
 * There are two steps/states for this component:
 *  1. Select the type of verification method (email or phone number)
 *  2. Enter the code received via the selected email or phone number.
 */

const validAuthStates = [AuthState.verifyContact];
const viewStep = {
  select: 'select', // User chooses how they will receive code.
  verify: 'verify', // User inputs and submits code.
};

export function VerifyContact(props) {
  const [step, setStep] = React.useState(viewStep.select);
  const [contact, setSelection] = React.useState('');
  const [code, setCode] = React.useState('');

  function verifyCode() {
    Auth.verifyCurrentUserAttributeSubmit(contact, code)
      .then(async () => {
        const newUser = await Auth.currentAuthenticatedUser();
        props.onStateChange(AuthState.signedIn, newUser);
      })
      .catch(err => {
        // TODO: error
        console.info({ 'verify error': err });
      });
  }

  function verifySelection() {
    Auth.verifyCurrentUserAttribute(contact)
      .then(() => {
        setStep(viewStep.verify);
      })
      .catch(err => {
        // TODO: error
        console.info({ 'select error': err });
      });
  }

  function skipVerification() {
    props.onStateChange(AuthState.signedIn, props.authData);
  }

  return validAuthStates.includes(props.authState) ? (
    <>
      {step === viewStep.select ? (
        <>
          <Select
            onSelect={setSelection}
            onSubmit={verifySelection}
            {...props}
          />
          <div>
            <Button onClick={() => setStep(viewStep.verify)}>
              Already have a code
            </Button>
          </div>
        </>
      ) : (
        <>
          <Verify onChange={setCode} onSubmit={verifyCode} />
          <div>
            <Button onClick={() => setStep(viewStep.select)}>
              Resend Code
            </Button>
          </div>
        </>
      )}
      <Button onClick={skipVerification}>Skip</Button>
      <pre>{JSON.stringify({ contact, code }, null, 2)}</pre>
    </>
  ) : null;
}

// User selects the method to receive code.
function Select(props) {
  const { onSelect, onSubmit } = props;
  const {
    unverified: { email, phone_number },
  } = props.authData;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  function handleSelect(e) {
    const {
      currentTarget: { value },
    } = e;
    onSelect(value);
  }

  return (
    <>
      <p>Select how to receive your code:</p>
      <div>
        <Form onSubmit={handleSubmit}>
          {email && (
            <>
              <Input
                type='radio'
                name='contact'
                value='email'
                onChange={handleSelect}
              />
              <Label>Email</Label>
            </>
          )}
          {phone_number && (
            <>
              <Input
                type='radio'
                name='contact'
                value='phone_number'
                onChange={handleSelect}
              />
              <Label>Phone Number</Label>
            </>
          )}
          <div>
            <Button>Submit</Button>
          </div>
        </Form>
      </div>
    </>
  );
}

function Verify(props) {
  const { onChange, onSubmit } = props;
  function handleSubmit(e) {
    e.preventDefault();

    onSubmit();
  }

  function handleInputChange(e) {
    const {
      currentTarget: { value },
    } = e;

    onChange(value);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label>Code</Label>
      </div>
      <div>
        <Input name='code' onChange={handleInputChange} />
      </div>
      <div>
        <Button>Verify</Button>
      </div>
    </Form>
  );
}

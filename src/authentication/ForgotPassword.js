import React from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthState';
import { Button, Form, Input, Label } from '../components';

const validAuthStates = [AuthState.forgotPassword];

const viewState = {
  requestCode: 'requestCode',
  verifyCode: 'verifyCode',
};

/**
 * Functionality
 *  - Request a code (to be emailed/texted)
 *  - Enter a code and new password
 *  - Request a new code
 *  - Go back to SignIn
 */

export function ForgotPassword(props) {
  const [view, setView] = React.useState(viewState.requestCode);
  const [form, setForm] = React.useState({ username: '', code: '' });

  function handleSubmit(e) {
    e.preventDefault();

    const { username, code, password } = form;

    // TODO? Break this into separate views?
    if (username && code && password) {
      Auth.forgotPasswordSubmit(username, code, password)
        .then(data => {
          console.log('password reset submit success', { data });
          // TODO!: Notify User of SUCCESS
          props.onStateChange(AuthState.signIn);
        })
        .catch(err => {
          // TODO: Error
          console.info('password reset submit error', { err });
        });
    }
  }

  function handleInputChange(e) {
    const {
      currentTarget: { name, value },
    } = e;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function requestCode() {
    Auth.forgotPassword(form.username)
      .then(data => {
        // TODO: Let User know code request was successfully sent.
        // - data returns CodeDeliveryDetails: { AttributeName: 'email', DeliveryMedium: 'EMAIL', Destination: 'u***@e***.com' }
        console.log('forgotPassword code request response', { data });
        setView(viewState.verifyCode);
      })
      .catch(err => {
        // TODO: error
        // "Attempt limit exceeded, please try after some time." when requesting new code too frequently.
        console.info('request forgotPassword code request response', { err });
      });
  }

  return validAuthStates.includes(props.authState) ? (
    view === viewState.requestCode ? (
      <Form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div>
          <Label>Username</Label>
        </div>
        <div>
          <Input name='username' onChange={handleInputChange} />
        </div>
        <div>
          <Button onClick={requestCode} disabled={!form.username}>
            Request Code
          </Button>
          <Button onClick={() => setView(viewState.verifyCode)}>
            Already have code?
          </Button>
        </div>
      </Form>
    ) : (
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Username</Label>
        </div>
        <div>
          <Input name='username' onChange={handleInputChange} />
        </div>
        <div>
          <Label>Code</Label>
        </div>
        <div>
          <Input name='code' onChange={handleInputChange} />
        </div>
        <div>
          <Label>New Password</Label>
        </div>
        <div>
          <Input
            disabled={!form.code}
            name='password'
            onChange={handleInputChange}
            type='password'
          />
        </div>
        <Button disabled={!(form.username && form.code && form.password)}>
          Update Password
        </Button>
        <Button
          type='button' // prevent button click on form submission
          onClick={e => {
            console.log('clicked');
            e.preventDefault();
            setView(viewState.requestCode);
          }}
        >
          Request code
        </Button>
      </Form>
    )
  ) : null;
}

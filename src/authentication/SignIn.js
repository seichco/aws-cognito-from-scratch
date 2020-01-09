import React from 'react';
import { Input, Button, Label } from '../components/forms';

export function SignIn(props) {
  return (
    <form>
      <div>
        <Label>Username</Label>
        <br />
        <Input />
      </div>
      <div>
        <Label>Password</Label>
        <br />
        <Input type='password' />
      </div>
      <div>
        <Button>Sign In</Button>
      </div>
    </form>
  );
}

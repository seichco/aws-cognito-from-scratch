import React from 'react';
import { AuthState } from './AuthState';

export function StatePicker(props) {
  function handleChange(e) {
    const {
      currentTarget: { value },
    } = e;
    const user = props.authData;

    props.onStateChange(value, user);
  }
  return (
    <select onChange={handleChange}>
      <option></option>
      {Object.values(AuthState).map(state => {
        return <option key={state}>{state}</option>;
      })}
    </select>
  );
}

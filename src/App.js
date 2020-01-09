import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SignIn } from './authentication/SignIn';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Custom AWS Cognito Amplify Component</h1>
        <SignIn />
      </header>
    </div>
  );
}

export default App;

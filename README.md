This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- [Sign In](#sign-in)
- [Sign Out](#sign-out)
- [TOTP Setup](#the-one-time-password-totp-setup)
- [TOTP Confirmation](#the-one-time-password-totp-confirmation)
- [Verify Contact](#verify-contact)
- [Reset Password](#reset-password)
- [Forgot Password](#forgot-password)

## Sign In

- User submits a **username**/**password** form.
- States Visible
  - `signIn`
  - `signedOut`
  - `signedUp`
- Methods
  - `Auth.signIn(username, password)`

### API Responses

- `Auth.signIn(username, password).then(user);`
  - `User` may be sent to the [Change Password](#forgot-password) screen.
    ```javascript
    user.challengeName === 'NEW_PASSWORD_REQUIRED';
    ```
  - `User` may be sent to the [TOTP](#the-one-time-password-totp-confirmation) screen.
    ```javascript
    user.challengeName === 'SOFTWARE_TOKEN_MFA' ||
      user.challengeName === 'SMS_MFA';
    ```
  - `User` may be sent to the [TOTP Setup](#the-one-time-password-totp-setup) screen.
    ```javascript
    user.challengeName === 'MFA_SETUP';
    ```
  - **_Note:_** `challengeName` may be empty (if MFA is not set/required) or tied to a custom challenge flow (not demonstrated here).

### API Errors

- `Auth.signIn(username, password).catch(error);`
  ```javascript
  // Bad username. Only happens if Prevent User Existence Errors is not "Enabled (Recommended)."
  {
    code: "UserNotFoundException",
    name: "UserNotFoundException",
    message: "User does not exist."
  }
  ```
  ```javascript
  // Bad password.
  {
    code: "NotAuthorizedException",
    name: "NotAuthorizedException",
    message: "Incorrect username or password."
  }
  ```

### Secondary Actions

- `User` can request a [password reset](#forgot-password)

---

## Sign out

- `User` clicks a button, logs out, and deletes session data.
- States Visible
  - `signedIn`
  - TODO? Should this just show up everywhere that isn't SignIn to allow `User` to start over?
- Methods
- `Auth.signOut()`

### API Responses

- `Auth.signOut().then(undefined)`
  ```javascript
  // Nothing gets returned.
  // `authState` is automatically set to `signIn`.
  ```

### API Errors

- Couldn't trigger any

### Secondary Actions

- N/A

---

## The One-Time Password (TOTP) Setup

- `User` is presented a QR code to set up their device and enters a six-digit code into a form.
- States Visible
  - `TOTPSetup`
- Methods
  - `Auth.setupTOTP(user)`
  - `Auth.verifyTotpToken(user, code)`
  - `Auth.setPreferredMFA(user, preference)`
  - `Auth.verifiedContact(user)`

### API Responses

- `Auth.setupTOTP(user).then(qrSetupCode)`
  ```javascript
  // Returns a string ID to populate generated QR code.
  ```
- `Auth.verifyTotpToken(user, code).then(response)`
  ```javascript
  'SUCCESS';
  ```

### API Errors

- `Auth.verifyTotpToken(user, code).catch(err);`
  ```javascript
  // User attempts code from previous device setup (old QR scan).
  {
    code: "EnableSoftwareTokenMFAException",
    name: "EnableSoftwareTokenMFAException",
    message: "Code mismatch and fail enable Software Token MFA"
  }
  ```
  ```javascript
  // QR code has gone stale before User can set up device. (Need to refresh page, and possibly try setting up device again.)
  {
    code: "NotAuthorizedException",
    name: "NotAuthorizedException",
    message: "Invalid session for the user, session is expired."
  }
  ```

### Secondary Actions

---

## The One-Time Password (TOTP) Confirmation

- `User` enters a six-digit code into a form.
- States Visible
  - `confirmSignIn`
- Methods

### API Responses

### API Errors

- `Auth.confirmSignIn(user, code, challengeName).catch(err)`
  ```javascript
  // User sits on screen too long before entering a valid code.
  {
    code: "NotAuthorizedException",
    name: "NotAuthorizedException",
    message: "Invalid session for the user, session is expired."
  }
  ```

### Secondary Actions

- Give `User` the ability to ???refresh/sign out/renew session??? so they can get a new session.

---

## Verify Contact

- `User` selects a method for **email** or **phone** verification, receives a six-digit code via that method, and enters that six-digit code into a form.
- States Visible
  - `verifyContact`
- Methods
  - `Auth.verifyCurrentUserAttributeSubmit(contactType, code)`
  - `Auth.verifyCurrentUserAttribute(contactType)`

### API Responses

- `Auth.verifyCurrentUserAttributeSubmit(contactType, code).then`
- `Auth.verifyCurrentUserAttribute(contactType)`

### API Errors

```javascript
// Incorrect verification code entered from email/sms.
{
  code: "CodeMismatchException",
  name: "CodeMismatchException",
  message: "Invalid verification code provided, please try again."
}
```

### Secondary Actions

---

## Reset Password

- `User` enters a **new password** into a form.
- States Visible
  - `requireNewPassword`
- Methods

### API Responses

### API Errors

### Secondary Actions

---

## Forgot Password

1. `User` enters their **username** into a form to receive a **six-digit** code.
1. `User` enters their **username**, **six-digit code**, and **new password** into a form to change their password.

- States Visible
  - `forgotPassword`
- Methods

### API Responses

### API Errors

### Secondary Actions

---

## Signed In

- `User` is presented the app.
- States Visible
  - `signedIn`
- Methods

### API Responses

### API Errors

### Secondary Actions

---

# (Template)

---

## Name

- Desc
- States
- Methods

### API Responses

### API Errors

### Secondary Actions

-

### API Errors

### Secondary Actions

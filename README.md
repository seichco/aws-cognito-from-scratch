This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- [Sign In](#sign-in)
- [Sign Out](#sign-out)
- [Set Password](#Set-password)
- [Forgot Password](#forgot-password)
- [TOTP Setup](#the-one-time-password-totp-setup)
- [TOTP Confirmation](#the-one-time-password-totp-confirmation)
- [Verify Contact](#verify-contact)
- [Other Considerations/Improvements](#other-considerationsimprovements)

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
  - `User` may be sent to the [Verify Contact](#verify-contact) screen if MFA is optional or not enabled.
    ```javascript
    user.challengeName === undefined;
    ```
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
  - **_Note:_** `challengeName` may be tied to a custom challenge flow (not demonstrated here).

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

### Possible Tests

- `User` gets error when failing username/password combo.
- `User` gets error if temporary password has expired.
- `User` can successfully log in and go to the appropriate _next_ screen:
  - _Password Change_ if the `User` hasn't changed the temp password.
  - _TOTP Setup_ if **MFA is set** and `User` **hasn't** registered a device.
  - _TOTP Confirmation_ if **MFA is set** and `User` **has** registered a device.
  - _Contact Confirmation_ if `User` hasn't verified their email.
  - _Protected Page(s)_ if `User` has satisfied the above conditions.
- `User` should receive an email with their temporary password if one is not given during admin registration/account creation.

---

## Sign out

- `User` clicks a button, logs out, and deletes session data.
- States Visible
  - `signedIn`
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

## Set Password

- `User` is required to enter a **new password** into a form.
- States Visible
  - `requireNewPassword`
- Methods
  - `Auth.completeNewPassword(user, password)`
  - `Auth.verifiedContact(user)`

### API Responses

- `Auth.completeNewPassword(user, password).then(user);`
  - `User` may be sent to the [Verify Contact](#verify-contact) screen if MFA is optional or not enabled.
    ```javascript
    user.challengeName === undefined;
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
  - **_Note:_** `challengeName` may be tied to a custom challenge flow (not demonstrated here).

### API Errors

- `Auth.completeNewPassword(user, password).catch(err);`
  ```javascript
  // User provides new password that doesn't meet requirements, such as password requires numbers
  {
    code: "InvalidPasswordException",
    name: "InvalidPasswordException",
    message: "Password does not conform to policy: Password must have numeric characters"
  }
  ```
  ```javascript
  // Session expired
  {
    code: "NotAuthorizedException",
    name: "NotAuthorizedException",
    message: "Invalid session for the user, session is expired."
  }
  ```

### Secondary Actions

- N/A

---

## Forgot Password

1. `User` enters their **username** into a form.
1. `User` receives a **six-digit** code via email.
1. `User` enters their **username**, **six-digit code**, and **new password** into a form to change their password.

- States Visible
  - `forgotPassword`
- Methods
  - `Auth.forgotPasswordSubmit(username, code, password)`
  - `Auth.forgotPassword(username)`

### API Responses

- TODO

### API Errors

- `Auth.forgotPasswordSubmit(username, code, password).catch(err);`

```javascript
// Wrong code or User tries reusing code after successful reset
{
  code: "ExpiredCodeException",
  name: "ExpiredCodeException",
  message: "Invalid code provided, please request a code again."
}
```

### Secondary Actions

- `User` can change views because they already have a code.
- `User` can go back to [Sign In](#sign-in) screen.

---

## The One-Time Password (TOTP) Setup

- `User` is presented a QR image to set up their device and enters a six-digit code into a form.
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
  // ID can also be entered manually into Authenticator App (if camera scanning is not available).
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

- `User` can skip verification process and go to [Signed In](#signed-in)

---

## Signed In

- `User` is presented the app.
- States Visible
  - `signedIn`
- Methods
  - N/A

### API Responses

- N/A

### API Errors

- N/A

### Secondary Actions

- `User` can [Sign Out](#sign-out)

---

## Other Considerations/Improvements

- Misc
  - First/primary textbox/input should auto-focus.
  - Hitting `ENTER` should submit the form.
  - ??? `User` should always be able to exit out of the flow? (Refresh would work, too.) ???
  - ??? `User` should be able to view their password (New Password, Forgot Password, Sign In). ???
- New Password
  - ??? `User` needs a way to refresh session when changing their password.
- Forgot Password
  - `User` should be notified of a successful password change (redirects them to form to sign in again).
- TOTP Setup
  - ??? `User` should be able to enter the QR code manually (printing the `secretCode` to the screen). ???
- Signed In
  - ??? `User` should be able to enable/disable MFA from `signedIn` state ???
- ??? `User` should be instructed to check their email on password request. ???
- `username` should carry over from **Sign In** to **Forgot Password**.
- `username` should carry over from **Forgot Password** to **Verify Code**.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Areas

### SignIn

- `User` is presented a `username` and `password` form.
  - `authState: "signIn"`
  - `User` can redirect to request a [password reset](#forgot/reset-password).
  - `User` can submit username/password form data.
    - `Auth.signIn() SUCCESS`
      - `User` may be sent to the [Change Password]() screen.
        ```javascript
        user.challengeName === 'NEW_PASSWORD_REQUIRED';
        ```
      - `User` may be sent to the [TOTP](<#the-one-time-password-(totp)>) screen.
        ```javascript
        user.challengeName === 'SOFTWARE_TOKEN_MFA' ||
          user.challengeName === 'SMS_MFA';
        ```
      - `User` may be sent to the [TOTP Setup](<#the-one-time-password-(totp)>) screen.
        ```javascript
        user.challengeName === 'MFA_SETUP';
        ```
      - **_Note:_** `challengeName` may be empty (if MFA is not set/required) or tied to a custom challenge flow (not demonstrated here).
    - `Auth.signIn() FAILURE`
      ```javascript
      // Bad username
      {
        code: "UserNotFoundException",
        name: "UserNotFoundException",
        message: "User does not exist."
      }
      ```
      ```javascript
      // Bad password
      {
        code: "NotAuthorizedException",
        name: "NotAuthorizedException",
        message: "Incorrect username or password."
      }
      ```

### The One Time Password (TOTP)

- `User` can enter a six-digit code.
  - `authState: "confirmSignIn"`
- `User` can set up their device by scanning a QR code.
  - `authState: "TOTPSetup"`
  - QR code is generated.
  - `User` can enter a six-digit code.
  - `User` is redirected:
    - Screen to verify contact info (`authState: "verifyContact"`)
    - Out of flow (`authState: "signedIn"`)

### Passwords

#### Temporary Password

- `User` can be assigned a temporary password.
  1. After successful [SignIn](#signin), `User` is presented a `Change Password` screen.
  - `authState: "requireNewPassword"`
  - `User` enters a new password
    - `SUCCESS`
    - `FAILURE`
      ```javascript
      // User tries to enter a new password after a length? of time.
      {
        code: "NotAuthorizedException",
        name: "NotAuthorizedException",
        message: "Invalid session for the user, session is expired."
      }
      ```

#### Forgot/Reset Password

- `User` is presented a `password reset` form.
  - `authState: "forgotPassword"`
  - `User` can go back to [SignIn](#signin).
  - `User` can change view if they've already received a code.
  - `User` can enter their `username` and request a code.
    - `SUCCESS`
    - `FAILURE`
      ```javascript
      // User never changed temporary password.
      {
        code: "NotAuthorizedException",
        name: "NotAuthorizedException",
        message: "User password cannot be reset in the current state."
      }
      ```
      ```javascript
      // User has repeatedly requested a code.
      {
        code: "LimitExceededException",
        name: "LimitExceededException",
        message: "Attempt limit exceeded, please try after some time."
      }
      ```
      ```javascript
      // Bad username/code submitted with new password.
      {
        code: "UserNotFoundException",
        name: "UserNotFoundException",
        message: "Username/client id combination not found."
      }
      ```
      ```javascript
      // User tries to update password after a length? of time.
      {
        code: "ExpiredCodeException",
        name: "ExpiredCodeException",
        message: "Invalid code provided, please request a code again."
      }
      ```

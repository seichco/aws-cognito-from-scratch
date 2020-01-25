import React from 'react';
import { Auth } from 'aws-amplify';

export const UserContext = React.createContext(null);

export function UserProvider(props) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // TODO: get config working.
    // Auth.configure({
    //   region: process.env.REACT_APP_REGION,
    //   userPoolId: process.env.REACT_APP_USER_POOL_ID,
    //   userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    // });

    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
  }, []);

  function login(username, password) {
    return Auth.signIn(username, password)
      .then(user => {
        setUser(user);
        return user;
      })
      .catch(err => {
        // TODO: SignIn Error
        console.error('login error: ', err);
      });
  }

  function logout() {
    return Auth.signOut().then(() => setUser(null));
  }

  const authApi = React.useMemo(() => ({ user, login, logout }), [user]);

  return (
    <UserContext.Provider value={authApi}>
      {props.children}
    </UserContext.Provider>
  );
}

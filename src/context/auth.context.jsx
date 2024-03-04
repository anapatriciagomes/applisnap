import { createContext, useState, useEffect } from 'react';
import { verify, getUserDetails } from '../api/auth.api';

const AuthContext = createContext();

const AuthProviderWrapper = props => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = token => {
    localStorage.setItem('authToken', token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      try {
        const response = await verify(storedToken);

        const userDetails = await getUserDetails(response.data._id);

        setUser(userDetails.data);

        console.log('user', userDetails.data);

        setLoggedIn(true);
      } catch (error) {
        console.log('Error authenticating user', error);
        setUser(null);
        removeToken();
        setLoggedIn(false);
      }
    } else {
      setUser(null);
      setLoggedIn(false);
    }

    setLoading(false);
  };

  const removeToken = () => {
    localStorage.removeItem('authToken');
  };

  const logoutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        loggedIn,
        user,
        storeToken,
        removeToken,
        authenticateUser,
        logoutUser,
        setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProviderWrapper };

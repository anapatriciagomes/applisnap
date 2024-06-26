import { useContext } from 'react';
import { ThemeContext } from '../context/theme.context';
import { AuthContext } from '../context/auth.context';
import UserImage from '../components/UserImage';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import DeleteAccountButton from '../components/DeleteAccountButton';
import ChangePasswordButton from '../components/ChangePasswordButton';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../components/Footer';
import LogInButton from '../components/LogInButton';
import SignUpButton from '../components/SignUpButton';

function Settings() {
  const { darkMode, width } = useContext(ThemeContext);
  const { loggedIn, user } = useContext(AuthContext);

  return (
    <div className="h-full min-h-[60vh] mx-[2%] mt-[10%]">
      <div className="flex flex-col">
        {loggedIn ? (
          <div className="mx-auto">
            <div className="mb-[30px] flex items-center">
              <UserImage />
              <h2 className="ml-[15px]">
                {user ? (
                  `${user.firstName} ${user.lastName}`
                ) : (
                  <CircularProgress />
                )}
              </h2>
            </div>
            <div className="mb-[30px] flex items-center">
              <EmailRoundedIcon
                sx={{
                  width: '36px',
                  height: '36px',
                  marginLeft: '15px',
                  marginRight: '15px',
                  color: darkMode ? 'white' : '#678B85',
                }}
              />
              <p className="ml-[15px]">
                {' '}
                {user ? `${user.email}` : <CircularProgress />}
              </p>
            </div>
            <div className="w-[100%] flex flex-col justify-center items-center">
              <div className="mb-[15px] w-[100%]">
                <ChangePasswordButton />
              </div>
              <DeleteAccountButton />
            </div>
          </div>
        ) : (
          <p className="text-center mt-[50px] font-bold text-xl">
            Please log in to view this page
          </p>
        )}
        {!loggedIn && width < 500 && (
          <div className="flex justify-center items-center gap-[15px] my-[30px]">
            <LogInButton />
            <SignUpButton />
          </div>
        )}
        <div className="my-[30px] mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Settings;

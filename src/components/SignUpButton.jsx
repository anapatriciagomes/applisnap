import { useState, useContext } from 'react';
import { ThemeContext } from '../context/theme.context';
import { signup } from '../api/auth.api';
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CancelButton from './CancelButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

function SignUpButton() {
  const [open, setOpen] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { darkMode } = useContext(ThemeContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value.trim());
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = event => {
    event.preventDefault();
    setShowPassword(show => !show);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const isStrongPassword = password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    return (
      password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit
    );
  };

  const handleSignUp = async () => {
    if (name.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    if (!isValidEmail) {
      alert('Invalid email format');
      return;
    }

    if (password.trim() === '') {
      alert('Password cannot be empty');
      return;
    }

    if (!isStrongPassword(password)) {
      alert(
        'Password is not strong enough. Please follow the password requirements.'
      );
      return;
    }

    const user = { name, email, password };

    setIsLoading(true);

    try {
      await signup(user);

      setIsLoading(false);
      alert('Your registration was successful, please log in.');
      setName('');
      setEmail('');
      setPassword('');
      handleClose();
    } catch (error) {
      setIsLoading(false);
      alert(error.response.data.message);
    }
  };

  const SignUpButtonStyled = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    color: 'white',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#678B85',
    borderColor: '#678B85',

    '&:hover': {
      backgroundColor: '#62a699',
      borderColor: '#62a699',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#30b39a',
      borderColor: '#30b39a',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(55, 89, 84, 0.5)',
    },
  });

  const SignUpDialogTitle = styled(DialogTitle)({
    color: darkMode ? 'white' : '#678B85',
  });

  return (
    <React.Fragment>
      <SignUpButtonStyled onClick={handleClickOpen}>Sign Up</SignUpButtonStyled>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
        }}
      >
        <SignUpDialogTitle>Sign Up</SignUpDialogTitle>
        <DialogContent>
          <FormControl
            variant="standard"
            required
            fullWidth
            sx={{
              '.MuiFormLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiInputLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
                color: '#30b39a',
              },
              '.MuiInput-underline:after': {
                borderBottom: '2px solid #678B85',
              },
              '&:hover': {
                '.MuiInput-underline:after': {
                  borderBottom: '2px solid #30b39a',
                },
              },
              '.MuiInput-root': {
                '&.Mui-focused': {
                  borderColor: '#30b39a',
                },
              },
              marginBottom: '15px',
            }}
          >
            <InputLabel htmlFor="standard-adornment-email">Name</InputLabel>
            <Input
              id="standard-adornment-name"
              value={name}
              onChange={handleNameChange}
              type="text"
              label="Name"
            />
          </FormControl>

          <FormControl
            variant="standard"
            required
            fullWidth
            sx={{
              '.MuiFormLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiInputLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
                color: '#30b39a',
              },
              '.MuiInput-underline:after': {
                borderBottom: '2px solid #678B85',
              },
              '&:hover': {
                '.MuiInput-underline:after': {
                  borderBottom: '2px solid #30b39a',
                },
              },
              '.MuiInput-root': {
                '&.Mui-focused': {
                  borderColor: '#30b39a',
                },
              },
              marginBottom: '15px',
            }}
          >
            <InputLabel htmlFor="standard-adornment-email">
              Email Address
            </InputLabel>
            <Input
              id="standard-adornment-email"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              error={!isValidEmail}
              type="email"
              label="Email Address"
            />
          </FormControl>

          <FormControl
            variant="standard"
            required
            fullWidth
            sx={{
              '.MuiFormLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiInputLabel-root': {
                color: theme =>
                  theme.palette.mode === 'dark' ? 'white' : '#678B85',
              },
              '.MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
                color: '#30b39a',
              },
              '.MuiInput-underline:after': {
                borderBottom: '2px solid #678B85',
              },
              '&:hover': {
                '.MuiInput-underline:after': {
                  borderBottom: '2px solid #30b39a',
                },
              },
              '.MuiInput-root': {
                '&.Mui-focused': {
                  borderColor: '#30b39a',
                },
              },
            }}
          >
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              autoComplete="on"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{
                      marginRight: 0,
                      marginLeft: '8px',
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <div className="mr-[6px]">
            {isLoading && (
              <CircularProgress
                sx={{ color: darkMode ? 'white' : '#678B85' }}
              />
            )}
          </div>
          <CancelButton
            setOpen={setOpen}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          <div className="mr-[16px]">
            <SignUpButtonStyled onClick={handleSignUp}>
              Sign Up
            </SignUpButtonStyled>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SignUpButton;
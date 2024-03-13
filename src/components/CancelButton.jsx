import { useContext } from 'react';
import Button from '@mui/material/Button';
import { ThemeContext } from '../context/theme.context';

function CancelButton({
  setOpen,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setForgotPasswordClicked,
  setBoardName,
  setCompanyName,
  setRoleName,
  setDomain,
  setJobURL,
  setJobDescription,
  setWorkModel,
  setWorkLocation,
  setNotes,
  setDate,
  setStarred,
  setListName,
  setDateLabel,
}) {
  const { lightButtonStyle } = useContext(ThemeContext);

  const handleClose = () => {
    setOpen(false);
    setEmail ? setEmail('') : '';
    setPassword ? setPassword('') : '';
    setFirstName ? setFirstName('') : '';
    setLastName ? setLastName('') : '';
    setForgotPasswordClicked ? setForgotPasswordClicked(false) : '';
    setBoardName ? setBoardName('') : '';
    setCompanyName ? setCompanyName() : '';
    setRoleName ? setRoleName() : '';
    setDomain ? setDomain() : '';
    setJobURL ? setJobURL() : '';
    setJobDescription ? setJobDescription() : '';
    setWorkModel ? setWorkModel() : '';
    setWorkLocation ? setWorkLocation() : '';
    setNotes ? setNotes() : '';
    setDate ? setDate({}) : '';
    setStarred ? setStarred(false) : '';
    setListName ? setListName() : '';
    setDateLabel ? setDateLabel : '';
  };

  return (
    <Button onClick={handleClose} sx={{ ...lightButtonStyle }}>
      Cancel
    </Button>
  );
}

export default CancelButton;

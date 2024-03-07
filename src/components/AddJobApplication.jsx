import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { ThemeContext } from '../context/theme.context';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Input,
  Switch,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CancelButton from '../components/CancelButton';
import { addJob } from '../api/jobs.api';

function AddJobApplication({ open, onClose }) {
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [domain, setDomain] = useState('');
  const [jobURL, setJobURL] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [workModel, setWorkModel] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [date, setDate] = useState('');
  const [starred, setStarred] = useState(false);
  const [board, setBoard] = useState('');
  const [list, setList] = useState('');

  const { user } = useContext(AuthContext);
  const { formGreenStyle, buttonGreenStyle } = useContext(ThemeContext);

  const handleSave = () => {
    let formattedDomain = domain.trim().toLowerCase();
    if (formattedDomain.startsWith('http://')) {
      formattedDomain = formattedDomain.slice(7);
    } else if (formattedDomain.startsWith('https://')) {
      formattedDomain = formattedDomain.slice(8);
    }
    if (formattedDomain.startsWith('www.')) {
      formattedDomain = formattedDomain.slice(4);
    }
    formattedDomain = formattedDomain.split('/')[0];

    const jobData = {
      companyName,
      roleName,
      domain: formattedDomain,
      jobURL,
      jobDescription,
      workModel,
      workLocation,
      notes,
      customLabel,
      date,
      starred,
      board,
      list,
      userId: user._id,
    };

    console.log('Data to be saved:', jobData);
    onClose();
    addJob(jobData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Job Application</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }} required>
          <InputLabel htmlFor="companyName">Company Name</InputLabel>
          <Input
            id="companyName"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="companyName">Role</InputLabel>
          <Input
            id="role"
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="domain">Domain</InputLabel>
          <Input
            id="domain"
            value={domain}
            placeholder=""
            onChange={e => setDomain(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="jobURL">Job URL</InputLabel>
          <Input
            id="jobURL"
            value={jobURL}
            onChange={e => setJobURL(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="jobDescription">Job Description</InputLabel>
          <Input
            id="jobDescription"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            multiline
            rows={2}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="workModel">Work Model</InputLabel>
          <Select
            id="workModel"
            value={workModel}
            onChange={e => setWorkModel(e.target.value)}
          >
            <MenuItem value={'On-Site'}>On-Site</MenuItem>
            <MenuItem value={'Remote'}>Remote</MenuItem>
            <MenuItem value={'Hybrid'}>Hybrid</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="workLocation">Work Location</InputLabel>
          <Input
            id="workLocation"
            value={workLocation}
            onChange={e => setWorkLocation(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <TextField
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="notes">Notes</InputLabel>
          <Input
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            multiline
            rows={2}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="customLabel">Custom Label</InputLabel>
          <Input
            id="customLabel"
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="board">Board</InputLabel>
          <Input
            id="board"
            value={board}
            onChange={e => setBoard(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
          <InputLabel htmlFor="list">List</InputLabel>
          <Select
            id="list"
            value={list}
            onChange={e => setList(e.target.value)}
          >
            <MenuItem value={'Wishlist'}>Wishlist</MenuItem>
            <MenuItem value={'Applied'}>Applied</MenuItem>
            <MenuItem value={'Interview'}>Interview</MenuItem>
            <MenuItem value={'Offers'}>Offers</MenuItem>
            <MenuItem value={'Rejected'}>Rejected</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={starred}
              onChange={e => setStarred(e.target.checked)}
              name="starred"
              color="primary"
            />
          }
          label="Starred"
        />
      </DialogContent>
      <DialogActions>
        <CancelButton
          setOpen={onClose}
          setCompanyName={setCompanyName}
          setRoleName={setRoleName}
          setDomain={setDomain}
          setJobURL={setJobURL}
          setJobDescription={setJobDescription}
          setWorkModel={setWorkModel}
          setWorkLocation={setWorkLocation}
          setNotes={setNotes}
          setCustomLabel={setCustomLabel}
          setDate={setDate}
          setStarred={setStarred}
          setBoard={setBoard}
          setList={setList}
        />
        <Button onClick={handleSave} sx={{ ...buttonGreenStyle }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddJobApplication;
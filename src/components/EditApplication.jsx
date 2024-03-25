import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { ThemeContext } from '../context/theme.context';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import CancelButton from '../components/CancelButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { editJob, deleteJob } from '../api/jobs.api';
import { getList } from '../api/lists.api';
import { getBoard } from '../api/boards.api';
import dayjs from 'dayjs';

function EditApplication({
  open,
  onClose,
  application,
  board,
  fetchBoard,
  lists,
  boardId,
  updateUser,
  currentListName,
  currentBoardName,
  setCurrentBoardName,
}) {
  const storedUserId = localStorage.getItem('userId');

  const { user } = useContext(AuthContext);

  const [companyName, setCompanyName] = useState(application.companyName);
  const [roleName, setRoleName] = useState(application.roleName);
  const [domain, setDomain] = useState(application.domain);
  const [jobURL, setJobURL] = useState(application.jobURL);
  const [jobDescription, setJobDescription] = useState(
    application.jobDescription
  );
  const [workModel, setWorkModel] = useState(application.workModel);
  const [workLocation, setWorkLocation] = useState(application.workLocation);
  const [notes, setNotes] = useState(application.notes);
  const [customLabel, setCustomLabel] = useState(application.customLabel);
  const [editDate, setEditDate] = useState(
    application.date ? application.date : {}
  );
  const [dateInput, setDateInput] = useState(dayjs());
  const [starred, setStarred] = useState(application.starred);
  const [list, setList] = useState(
    user && user.lists && application
      ? user.lists.filter(list => list._id === application.listId)[0]
      : {}
  );
  const [listName, setListName] = useState(
    currentListName
      ? currentListName
      : list.listName
      ? list.listName
      : 'Wishlist'
  );
  const [selectedBoardName, setSelectedBoardName] = useState('');
  const [boards, setBoards] = useState(user && user.boards ? user.boards : []);
  const [editDateLabel, setEditDateLabel] = useState(
    listName === 'Applied'
      ? 'applied'
      : listName === 'Interviews'
      ? 'interviews'
      : listName === 'Offers'
      ? 'offer'
      : listName === 'Rejected'
      ? 'rejected'
      : 'interviews'
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    darkMode,
    formGreenStyle,
    buttonGreenStyle,
    greenIconButtonStyle,
    greyIconButtonStyle,
  } = useContext(ThemeContext);

  useEffect(() => {
    if (application) {
      getData(application);
      setEditDate(application.date);
    }
    if (board) {
      setSelectedBoardName(board.boardName);
    }
    if (user) {
      setBoards(user.boards);
    }
    if (currentBoardName === 'All Boards' && updateUser) {
      setCurrentBoardName('All Boards');
    }
  }, [application]);

  const getData = async application => {
    try {
      const list = await getList(application.listId);
      setList(list);
      setListName(list.listName);
    } catch (error) {
      console.log('Error fetching data');
    }
  };

  const formatDate = unformattedDate =>
    dayjs(unformattedDate).format('DD/MM/YYYY');

  const handleAddDate = () => {
    if (dateInput) {
      let formattedDate = dayjs(dateInput).format('YYYY/MM/DD');
      switch (editDateLabel) {
        case 'created':
          setEditDate({ ...editDate, created: formattedDate });
          break;
        case 'applied':
          setEditDate({ ...editDate, applied: formattedDate });
          break;
        case 'interviews':
          if (editDate.interviews) {
            if (!editDate.interviews.includes(formattedDate)) {
              setEditDate({
                ...editDate,
                interviews: [
                  ...new Set([...editDate.interviews, formattedDate]),
                ].sort((a, b) => new Date(a) - new Date(b)),
              });
            }
          } else {
            setEditDate({ ...editDate, interviews: [formattedDate] });
          }
          break;
        case 'offer':
          setEditDate({ ...editDate, offer: formattedDate });
          break;
        case 'rejected':
          setEditDate({ ...editDate, rejected: formattedDate });
          break;
        default:
          setEditDate({ ...editDate, created: formattedDate });
      }
    }
  };

  const handleRemoveDate = (dateType, dateValue) => {
    if (dateInput) {
      switch (dateType) {
        case 'created':
          setEditDate({ ...editDate, created: null });
          break;
        case 'applied':
          setEditDate({ ...editDate, applied: null });
          break;
        case 'interviews':
          if (editDate.interviews.length > 1) {
            const updatedInterviewDates = editDate.interviews.filter(
              interview => interview !== dateValue
            );
            setEditDate({
              ...editDate,
              interviews: [...updatedInterviewDates],
            });
          } else {
            setEditDate({ ...editDate, interviews: [] });
          }
          break;
        case 'offer':
          setEditDate({ ...editDate, offer: null });
          break;
        case 'rejected':
          setEditDate({ ...editDate, rejected: null });
          break;
        default:
          setEditDate({ ...editDate, created: null });
      }
    }
  };

  const handleSave = async e => {
    e.preventDefault();

    if (companyName.trim() === '') {
      alert('Company name cannot be empty');
      return;
    }

    if (roleName.trim() === '') {
      alert('Role name cannot be empty');
      return;
    }

    let formattedDomain;
    if (domain) {
      formattedDomain = domain.trim().toLowerCase();
      if (formattedDomain.startsWith('http://')) {
        formattedDomain = formattedDomain.slice(7);
      } else if (formattedDomain.startsWith('https://')) {
        formattedDomain = formattedDomain.slice(8);
      }
      if (formattedDomain.startsWith('www.')) {
        formattedDomain = formattedDomain.slice(4);
      }
      formattedDomain = formattedDomain.split('/')[0];
    }

    const newBoard = boards.filter(
      board => board.boardName === selectedBoardName
    )[0];

    const newBoardDetails = await getBoard(newBoard._id);

    const newList = newBoardDetails.lists.filter(
      list => list.listName === listName
    )[0];

    const updatedDate = { ...editDate };

    if (application.listId !== newList._id) {
      let formattedDate = dayjs().format('YYYY/MM/DD');

      if (listName === 'Applied' && !updatedDate.applied) {
        updatedDate.applied = formattedDate;
      } else if (listName === 'Interviews') {
        if (updatedDate.interviews) {
          updatedDate.interviews = [
            ...updatedDate.interviews,
            formattedDate,
          ].sort((a, b) => new Date(a) - new Date(b));
        } else {
          updatedDate.interviews = [formattedDate];
        }
      } else if (listName === 'Offers' && !updatedDate.offer) {
        updatedDate.offer = formattedDate;
      } else if (listName === 'Rejected' && !updatedDate.rejected) {
        updatedDate.rejected = formattedDate;
      }
    }

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
      date: updatedDate,
      starred,
      boardId: newBoard._id,
      listId: newList._id,
      userId: user._id,
    };

    try {
      await editJob(application._id, jobData);

      if (currentBoardName !== 'All Boards') {
        await fetchBoard(boardId);
      }

      if (updateUser && currentBoardName === 'All Boards') {
        await updateUser(user._id);
      }
      await onClose();
    } catch (error) {
      console.log('Error saving changes', error);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteJob(application._id);

      if (updateUser && currentBoardName === 'All Boards') {
        setCurrentBoardName('All Boards');
        await updateUser(storedUserId);
      } else if (currentBoardName !== 'All Boards') {
        await fetchBoard(boardId);
      }

      onClose();
    } catch (error) {
      console.log('Error deleting job', error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const dateTypes = ['created', 'applied', 'interviews', 'offer', 'rejected'];

  const uniqueLists = [...new Set(lists.map(list => list.listName))];

  return (
    <Dialog open={open} onClose={onClose}>
      <form action="submit" onSubmit={handleSave}>
        <div className="flex justify-between items-center">
          <DialogTitle>Edit Job</DialogTitle>
          <button type="button" onClick={() => setStarred(!starred)}>
            {starred ? (
              <StarRoundedIcon
                sx={{
                  color: darkMode ? '#f9cc71' : '#e8a135',
                  width: '30px',
                  height: '30px',
                  margin: '24px',
                }}
              />
            ) : (
              <StarOutlineRoundedIcon
                sx={{
                  color: darkMode ? '#f9cc71' : '#e8a135',
                  width: '30px',
                  height: '30px',
                  margin: '24px',
                }}
              />
            )}
          </button>
        </div>
        <DialogContent>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }} required>
            <InputLabel htmlFor="companyName" label="Company Name">
              Company Name
            </InputLabel>
            <Input
              id="companyName"
              value={companyName}
              type="text"
              label="Company Name"
              onChange={e => setCompanyName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }} required>
            <InputLabel htmlFor="roleName" label="Role">
              Role
            </InputLabel>
            <Input
              id="roleName"
              value={roleName}
              type="text"
              label="Role"
              onChange={e => setRoleName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="domain" label="Company Website">
              Company Website
            </InputLabel>
            <Input
              id="domain"
              type="text"
              label="Company Website"
              value={domain}
              placeholder=""
              onChange={e => setDomain(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    sx={{
                      marginRight: 0,
                      marginLeft: '8px',
                      borderRadius: '5px',
                    }}
                  >
                    {domain && (
                      <a
                        href={
                          !domain.includes('://') ? `http://${domain}` : domain
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://logo.clearbit.com/${domain}` || ''}
                          alt=""
                          className="max-h-[20px] rounded-[2px]"
                        />
                      </a>
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="jobURL" label="Job URL">
              Job URL
            </InputLabel>
            <Input
              id="jobURL"
              type="text"
              label="Job URL"
              value={jobURL}
              onChange={e => setJobURL(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    sx={{
                      marginRight: 0,
                      marginLeft: '8px',
                      borderRadius: '50%',
                    }}
                  >
                    {jobURL && (
                      <a
                        href={jobURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkRoundedIcon
                          sx={{ width: '20px', height: '20px' }}
                        />
                      </a>
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="jobDescription" label="Job Description">
              Job Description
            </InputLabel>
            <Input
              id="jobDescription"
              value={jobDescription}
              type="text"
              label="Job Description"
              onChange={e => setJobDescription(e.target.value)}
              multiline
              rows={6}
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="notes" label="Notes">
              Notes
            </InputLabel>
            <Input
              id="notes"
              value={notes}
              type="text"
              label="Notes"
              onChange={e => setNotes(e.target.value)}
              multiline
              rows={2}
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="workLocation" label="Work Location">
              Work Location
            </InputLabel>
            <Input
              id="workLocation"
              type="text"
              label="Work Location"
              value={workLocation}
              onChange={e => setWorkLocation(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="workModel" label="Work Model">
              Work Model
            </InputLabel>
            <Select
              id="workModel"
              label="Work Model"
              type="text"
              value={workModel}
              onChange={e => setWorkModel(e.target.value)}
            >
              <MenuItem value={'On-Site'}>On-Site</MenuItem>
              <MenuItem value={'Remote'}>Remote</MenuItem>
              <MenuItem value={'Hybrid'}>Hybrid</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="list" label="List">
              List
            </InputLabel>
            <Select
              id="list"
              label="List"
              type="text"
              value={listName}
              onChange={e => setListName(e.target.value)}
              defaultValue={listName ? listName : 'Wishlist'}
            >
              {uniqueLists &&
                uniqueLists.map((list, index) => (
                  <MenuItem key={'EJ-Lists' + index} value={list}>
                    {list}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
            <InputLabel htmlFor="board" label="Board">
              Board
            </InputLabel>
            <Select
              id="board"
              label="Board"
              type="text"
              value={selectedBoardName}
              onChange={e => setSelectedBoardName(e.target.value)}
              defaultValue={selectedBoardName}
            >
              {boards &&
                boards.map(board => (
                  <MenuItem
                    key={'EJ-User' + board.boardName + board._id}
                    value={board.boardName}
                  >
                    {board.boardName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <div className="flex gap-[10px]">
            <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="date"
                  label="Date"
                  type="date"
                  openTo="day"
                  views={['year', 'month', 'day']}
                  inputFormat="YYYY-MM-DD"
                  value={dateInput}
                  onChange={newDate => {
                    setDateInput(newDate);
                  }}
                  defaultValue={dayjs().format('YYYY/MM/DD')}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth sx={{ ...formGreenStyle, my: 1 }}>
              <InputLabel htmlFor="editDateLabel" label="Date Label">
                Date Label
              </InputLabel>
              <Select
                id="editDateLabel"
                label="Date Label"
                type="text"
                value={editDateLabel}
                onChange={e => setEditDateLabel(e.target.value)}
                defaultValue={
                  listName === 'Applied'
                    ? 'applied'
                    : listName === 'Interviews'
                    ? 'interviews'
                    : listName === 'Offers'
                    ? 'offer'
                    : listName === 'Rejected'
                    ? 'rejected'
                    : 'interviews'
                }
              >
                {dateTypes &&
                  dateTypes.map((dateType, index) => (
                    <MenuItem key={index} value={dateType}>
                      <p className="capitalize">{dateType}</p>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <button type="button" onClick={handleAddDate}>
              <AddCircleOutlineRoundedIcon
                sx={{ ...greenIconButtonStyle, width: '20px', height: '20px' }}
              />
            </button>
          </div>
          {editDate && (
            <Timeline>
              {editDate.created && (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    Created
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {formatDate(editDate.created)}
                  </TimelineContent>
                </TimelineItem>
              )}

              {editDate.applied && (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    Applied
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="flex items-center gap-[5px]">
                      <p className="w-[100px]">
                        {formatDate(editDate.applied)}
                      </p>
                      <button
                        type="button"
                        className="flex items-center"
                        onClick={() => handleRemoveDate('applied')}
                      >
                        <HighlightOffRoundedIcon
                          sx={{
                            ...greyIconButtonStyle,
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      </button>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              )}

              {editDate.interviews && editDate.interviews.length > 0 && (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    {[...new Set(editDate.interviews)].length === 1
                      ? 'Interview'
                      : 'Interviews'}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <ul>
                      {[...new Set(editDate.interviews)].map(
                        (interview, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-[5px]"
                          >
                            <li className="w-[100px]">
                              {formatDate(interview)}
                            </li>
                            <button
                              type="button"
                              className="flex items-center"
                              onClick={() =>
                                handleRemoveDate('interviews', interview)
                              }
                            >
                              <HighlightOffRoundedIcon
                                sx={{
                                  ...greyIconButtonStyle,
                                  width: '20px',
                                  height: '20px',
                                }}
                              />
                            </button>
                          </div>
                        )
                      )}
                    </ul>
                  </TimelineContent>
                </TimelineItem>
              )}

              {editDate.offer && (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    Offer
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="flex items-center gap-[5px]">
                      <p className="w-[100px]">{formatDate(editDate.offer)}</p>
                      <button
                        type="button"
                        className="flex items-center"
                        onClick={() => handleRemoveDate('offer')}
                      >
                        <HighlightOffRoundedIcon
                          sx={{
                            ...greyIconButtonStyle,
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      </button>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              )}

              {editDate.rejected && (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    Rejected
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="flex items-center gap-[5px]">
                      <p className="w-[100px]">
                        {formatDate(editDate.rejected)}
                      </p>
                      <button
                        type="button"
                        className="flex items-center"
                        onClick={() => handleRemoveDate('rejected')}
                      >
                        <HighlightOffRoundedIcon
                          sx={{
                            ...greyIconButtonStyle,
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      </button>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          )}
        </DialogContent>
        <DialogActions>
          <CancelButton
            setOpen={onClose}
            setCompanyName={setCompanyName}
            setDomain={setDomain}
            setJobURL={setJobURL}
            setJobDescription={setJobDescription}
            setWorkModel={setWorkModel}
            setWorkLocation={setWorkLocation}
            setNotes={setNotes}
            setCustomLabel={setCustomLabel}
            setEditDate={setEditDate}
            setStarred={setStarred}
            application={application}
            listName={listName}
          />
          <Button
            type="submit"
            onClick={handleSave}
            sx={{ ...buttonGreenStyle }}
          >
            Save
          </Button>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </DialogActions>
      </form>
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this job?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} sx={{ color: '#678B85' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{ color: '#678B85' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default EditApplication;

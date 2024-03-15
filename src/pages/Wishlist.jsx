import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { editJob, deleteJob } from '../api/jobs.api';
import { ThemeContext } from '../context/theme.context';
import EditApplication from '../components/EditApplication';
import { getAllBoards } from '../api/boards.api';
import { getUserDetails } from '../api/auth.api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const Wishlist = () => {
  const { loggedIn, user, setUser } = useContext(AuthContext);
  const { darkMode, formGreenStyle } = useContext(ThemeContext);
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem('userId');
  const [wishlistJobs, setWishlistJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState(null);
  const [boardName, setBoardName] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');

  const { boardId } = useParams();

  const handleBoardSelection = e => {
    const selectedBoardName = e.target.value;
    const selectedBoard = user.boards.find(
      board => board.boardName === selectedBoardName
    );
    if (selectedBoard) {
      setBoardName(selectedBoard.boardName);
      setSelectedBoardId(selectedBoard._id);
      navigate(`/wishlist/${selectedBoard._id}`);
    }
  };

  const updateUser = async () => {
    try {
      const newDetails = await getUserDetails(storedUserId);
      setUser(newDetails.data);

      setBoards(newDetails.data.boards);
      setLists(newDetails.data.lists);

      const filteredJobs = newDetails.data.jobs.filter(job =>
        newDetails.data.lists
          .filter(list => list.listName === 'Wishlist')
          .map(list => list._id)
          .includes(job.listId)
      );

      setWishlistJobs(filteredJobs);

      if (
        boardId &&
        newDetails.data.boards.find(board => board._id === boardId)
      ) {
        const selectedBoard = newDetails.data.boards.find(
          board => board._id === boardId
        );
        setBoardName(selectedBoard.boardName);
        setSelectedBoardId(selectedBoard._id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    updateUser();
  }, [storedUserId, boardId]);

  const handleEdit = job => {
    setSelectedApplication(job);
  };

  const handleEditClose = () => {
    setSelectedApplication(null);
  };

  const fetchBoard = async () => {
    try {
      if (user && user._id) {
        const allBoardsResponse = await getAllBoards();
        const userBoards = allBoardsResponse.data.filter(
          board => board.userId === user._id
        );

        setBoards(userBoards);
      }
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const onEditApplication = async updatedJob => {
    try {
      await editJob(updatedJob._id, updatedJob);
      updateUser();
      handleEditClose();
    } catch (error) {
      console.error('Error editing job:', error);
    }
  };

  const handleDelete = job => {
    setDeletingJob(job);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteJob(deletingJob._id);
      updateUser();
      setDeleteDialogOpen(false);
      setDeletingJob(null);
    } catch (error) {
      console.log('Error deleting job', error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingJob(null);
  };

  return (
    <div className="m-[2%] mt-[30px]">
      {loggedIn ? (
        <div>
          <div className="flex justify-between items-center">
            <h2
              className={`text-[1.4em] mt-4 mb-6 ${
                darkMode ? 'text-white' : 'text-[#678B85]'
              }`}
            >
              Wishlist
            </h2>
            {user && user.boards.length > 1 && (
              <form>
                <FormControl sx={{ ...formGreenStyle, my: 1 }}>
                  <InputLabel htmlFor="board" label="Board">
                    Board
                  </InputLabel>
                  <Select
                    id="board"
                    label="Board"
                    type="text"
                    value={boardName}
                    onChange={e => handleBoardSelection(e)}
                  >
                    {user.boards.map(board => (
                      <MenuItem key={board._id} value={board.boardName}>
                        {board.boardName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>
            )}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {wishlistJobs
              .filter(job => job.boardId === selectedBoardId)
              .map((job, index) => {
                const jobBoard = boards.find(
                  board => board._id === job.boardId
                );
                return (
                  <Card key={index} sx={{ maxWidth: 120 }}>
                    <CardMedia
                      component="img"
                      alt="job logo"
                      height="100"
                      image={`https://logo.clearbit.com/${job.domain}`}
                      sx={{
                        p: 1,
                        mb: 1,
                        minWidth: 50,
                        maxWidth: 120,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        component="div"
                      >
                        {job.companyName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.roleName}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: 'center', width: '90%' }}
                    >
                      <Button
                        size="small"
                        sx={{ color: '#678B85', ml: 0.5, mr: 0, pr: 0 }}
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </Button>
                      {selectedApplication &&
                        selectedApplication._id === job._id && (
                          <EditApplication
                            open={Boolean(selectedApplication)}
                            onClose={handleEditClose}
                            application={selectedApplication}
                            board={jobBoard}
                            fetchBoard={fetchBoard}
                            boardId={jobBoard ? jobBoard._id : null}
                            onEdit={onEditApplication}
                            updateUser={updateUser}
                            lists={lists}
                          />
                        )}
                      <Button
                        size="small"
                        sx={{ color: '#678B85', ml: 0, pl: 0 }}
                        onClick={() => handleDelete(job)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            {wishlistJobs.length === 0 && (
              <div className="text-center col-span-full mt-4">
                <Typography variant="body1">
                  You have no jobs in this list.
                </Typography>
              </div>
            )}
          </div>
          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this job?
              </Typography>
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
        </div>
      ) : (
        <p className="text-center mt-[50px] font-bold text-xl">
          Please log in to view this page
        </p>
      )}
    </div>
  );
};

export default Wishlist;

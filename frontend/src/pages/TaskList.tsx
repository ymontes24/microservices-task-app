import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import taskService from '../services/task.service';
import { Task, TaskStatus, CreateTaskData, UpdateTaskData } from '../types';

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'default';
    case TaskStatus.IN_PROGRESS:
      return 'primary';
    case TaskStatus.DONE:
      return 'success';
    default:
      return 'default';
  }
};

const TaskList: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit'>('create');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<CreateTaskData | UpdateTaskData>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTask = () => {
    setDialogType('create');
    setTaskForm({
      title: '',
      description: '',
      status: TaskStatus.TODO,
    });
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setDialogType('edit');
    setCurrentTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setOpenDialog(true);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
      const { name, value } = e.target;
      setTaskForm({
        ...taskForm,
        [name]: value,
      });
  };

  const handleSubmitTask = async () => {
    try {
      if (dialogType === 'create') {
        const newTask = await taskService.createTask(taskForm as CreateTaskData);
        setTasks([...tasks, newTask]);
      } else if (dialogType === 'edit' && currentTask) {
        const updatedTask = await taskService.updateTask(currentTask._id, taskForm);
        setTasks(tasks.map(task => task._id === currentTask._id ? updatedTask : task));
      }
      handleDialogClose();
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Tasks
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            sx={{ mr: 2 }}
          >
            New Task
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      
      {user && (
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Welcome, {user.name}!
        </Typography>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No tasks found. Create your first task!</Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {tasks.map((task, index) => (
              <React.Fragment key={task._id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEditTask(task)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="span">
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={task.description || 'No description'}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{dialogType === 'create' ? 'Create New Task' : 'Edit Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            value={taskForm.title}
            onChange={handleFormChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={taskForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={taskForm.status}
              label="Status"
              onChange={handleFormChange}
            >
              <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmitTask} variant="contained">
            {dialogType === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;

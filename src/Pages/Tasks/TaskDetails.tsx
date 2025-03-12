import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, SelectChangeEvent } from '@mui/material';
import { TaskAPI } from '../../API/TasksAPICall';
import { getTask, updateTask, deleteTask } from '../../API/TaskDetailsAPI'; // Adjust the path

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
};

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask(parseInt(taskId!));
        if (data && data.task_Id !== undefined) { // Check if data.task_Id exists
          const formattedTask = {
            id: data.task_Id, // No toString() needed
            title: data.taskTitle,
            assignee: data.assigned_To.toString(),
            dueDate: data.deadline.split('T')[0],
            priority: data.priority as 'High' | 'Medium' | 'Low',
            status: data.status as 'Open' | 'In Progress' | 'Completed',
            locked: false,
          };
          setTask(formattedTask);
          setEditedTask(formattedTask);
        } else {
          setError("Task data is incomplete.");
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
  
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [e.target.name]: e.target.value as 'High' | 'Medium' | 'Low' | 'Open' | 'In Progress' | 'Completed' });
    }
  };

  const handleSave = async () => {
    if (editedTask) {
      try {
        const updateData = {
          taskTitle: editedTask.title,
          assignedTo: parseInt(editedTask.assignee),
          deadline: `${editedTask.dueDate}T23:59:59`,
          status: editedTask.status,
          priority: editedTask.priority,
        };
        await updateTask(parseInt(editedTask.id), updateData);
        setTask(editedTask);
        setEditMode(false);
      } catch (err) {
        console.error('Error updating task:', err);
        setError('Failed to update task');
      }
    }
  };

  const handleDelete = async () => {
    if (task) {
      try {
        await deleteTask(parseInt(task.id));
        navigate('/tasks');
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!task) return <Typography>Task not found.</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>

      {editMode ? (
        <>
          <TextField label="Title" name="title" value={editedTask?.title || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Assignee" name="assignee" value={editedTask?.assignee || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Due Date" name="dueDate" type="date" value={editedTask?.dueDate || ''} onChange={handleInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select labelId="priority-select-label" id="priority-select" name="priority" value={editedTask?.priority || 'Medium'} onChange={handleSelectChange} label="Priority">
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select labelId="status-select-label" id="status-select" name="status" value={editedTask?.status || 'Open'} onChange={handleSelectChange} label="Status">
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>Save</Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
          </Box>
        </>
      ) : (
        <>
          <Typography><strong>Title:</strong> {task.title}</Typography>
          <Typography><strong>Assignee:</strong> {task.assignee}</Typography>
          <Typography><strong>Due Date:</strong> {task.dueDate}</Typography>
          <Typography><strong>Priority:</strong> {task.priority}</Typography>
          <Typography><strong>Status:</strong> {task.status}</Typography>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setEditMode(true)} sx={{ mr: 1 }}>Edit</Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default TaskDetails;
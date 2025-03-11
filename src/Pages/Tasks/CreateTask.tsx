import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TaskAPI } from '../../API/TasksAPICall';
import { Task } from '../../API/TasksAPICall';

interface CreateTaskProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: Task) => void;
  isAdmin: boolean;
}

const CreateTask: React.FC<CreateTaskProps> = ({ open, onClose, onTaskCreated, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [assignee, setAssignee] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!assignee) newErrors.assignee = 'Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
        const newTask = await TaskAPI.createTask({
            taskTitle: title,
            description,
            assignedTo: parseInt(assignee),
            status: 'Open',
            priority, 
            deadline: dueDate?.toISOString() || new Date().toISOString()
          });

      onTaskCreated({
        ...newTask,
        id: newTask.id.toString(),
        title: newTask.taskTitle,
        assignee: newTask.assignedTo.toString(),
        dueDate: newTask.deadline.split('T')[0],
        locked: false
      });

      handleClose();
    } catch (error) {
      console.error('Task creation failed:', error);
      setErrors({ form: 'Failed to create task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(new Date());
    setAssignee('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        {errors.form && (
          <FormHelperText error sx={{ mb: 2 }}>
            {errors.form}
          </FormHelperText>
        )}

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          required
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth margin="normal" error={!!errors.priority}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value as typeof priority)}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.assignee}>
          <InputLabel>Assignee</InputLabel>
          <Select
            value={assignee}
            label="Assignee"
            onChange={(e) => setAssignee(e.target.value)}
            required
          >
            {/* Replace with actual user list from API */}
            <MenuItem value="1">Kevin Zhang</MenuItem>
            <MenuItem value="2">Vu Drudh</MenuItem>
          </Select>
          {errors.assignee && <FormHelperText>{errors.assignee}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.dueDate}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            minDate={new Date()}
          />
          {errors.dueDate && (
            <FormHelperText>{errors.dueDate}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTask;
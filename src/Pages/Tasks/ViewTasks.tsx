import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Skeleton, 
  Snackbar,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import CreateTask from './CreateTask';


type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
};

const ViewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskAPI.getUserTasks({
          search: searchTerm,
          priority: priorityFilter,
          status: statusFilter
        });
        const formattedTasks = data.map((task: any) => ({
          id: task.id.toString(),
          title: task.taskTitle,
          assignee: task.assignedTo.toString(),
          dueDate: task.deadline.split('T')[0],
          priority: task.priority as 'High' | 'Medium' | 'Low',
          status: task.status as 'Open' | 'In Progress' | 'Completed',
          locked: false
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [searchTerm, priorityFilter, statusFilter]);
  
//I have removed the example tasks from local machine

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      //convert back to API format if needed
      const updateData = {
        taskTitle: updatedTask.title,
        assignedTo: parseInt(updatedTask.assignee),
        deadline: `${updatedTask.dueDate}T23:59:59`,
        status: updatedTask.status,
        priority: updatedTask.priority
      };
      
      await TaskAPI.updateTask(parseInt(updatedTask.id), updateData);
      setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(parseInt(taskId));
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleLockTask = async (taskId: string) => {
    try {
      //Lock end points in API
      //if we have it, then use this TaskAPI.lockTask(parseInt(taskId));
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, locked: !task.locked } : task
      ));
    } catch (error) {
      console.error('Error locking task:', error);
      setError('Failed to toggle lock status');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h1" sx={{ 
          fontSize: '2.5rem', 
          fontWeight: 500, 
          color: 'primary.main' 
        }}>
          Task Management
        </Typography>
        
        <Box>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              sx={{ mr: 2, textTransform: 'none', borderRadius: 2, py: 1, px: 3 }}
            >
              Manage Users
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: 'none', borderRadius: 2, py: 1, px: 3 }}
          >
            New Task
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <CreateTask
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={(newTask) => {
          setTasks(prev => [newTask, ...prev] as Task[]);
        }}
        isAdmin={isAdmin}
      />

      {loading ? (
        <Box sx={{ width: '100%' }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangular" 
              height={56} 
              sx={{ mb: 1 }} 
            />
          ))}
        </Box>
      ) : (
        <TasksTable
          tasks={tasks}
          isAdmin={isAdmin}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onLockTask={handleLockTask}
        />
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

export default ViewTasks;
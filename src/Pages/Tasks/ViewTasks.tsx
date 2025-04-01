import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Skeleton, Snackbar, TextField } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import CreateTask from './CreateTask';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskAPI.getUserTasks();
        const formattedTasks = data.map((task: any) => ({
          id: task.id.toString(),
          title: task.taskTitle,
          assignee: task.assignedTo.toString(),
          dueDate: task.deadline.split('T')[0],
          priority: task.priority as 'High' | 'Medium' | 'Low',
          status: task.status as 'Open' | 'In Progress' | 'Completed',
          locked: false,
        }));
        setTasks(formattedTasks);
        setFilteredTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTasks(
      tasks.filter(task => task.title.toLowerCase().includes(query))
    );
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updateData = {
        taskTitle: updatedTask.title,
        assignedTo: updatedTask.assignee,
        deadline: `${updatedTask.dueDate}T23:59:59`,
        status: updatedTask.status,
        priority: updatedTask.priority,
      };
      await TaskAPI.updateTask(parseInt(updatedTask.id), updateData);
      const updatedTaskList = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTaskList);
      const loweredQuery = searchQuery.toLowerCase();
      const filtered = loweredQuery
        ? updatedTaskList.filter((task) =>
            task.title.toLowerCase().includes(loweredQuery)
          ) : updatedTaskList;
      setFilteredTasks(filtered);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(parseInt(taskId));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setFilteredTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleLockTask = async (taskId: string) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, locked: !task.locked } : task))
      );
    } catch (error) {
      console.error('Error locking task:', error);
      setError('Failed to toggle lock status');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '2.5rem',
            fontWeight: 500,
            color: 'primary.main',
          }}
        >
          Task Management
        </Typography>

        <Box>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              component={Link}
              to="/manage-users"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1,
                px: 3,
                mr: 2,
              }}
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

      <CreateTask
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev] as Task[]);
          if (searchQuery.trim() === '' || newTask.taskTitle.toLowerCase().includes(searchQuery)) {
            setFilteredTasks(prev => [newTask, ...prev] as Task[]);
          }
        }}
        isAdmin={isAdmin}
      />

      {loading ? (
        <Box sx={{ width: '100%' }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={56} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : (
        <>
        <TextField
  label="Search Tasks"
  variant="outlined"
  size="small"
  value={searchQuery}
  onChange={handleSearchChange}
  sx={{ mb: 2, width: '100%', maxWidth: 400 }}
/>
        <TasksTable
          tasks={filteredTasks}
          isAdmin={isAdmin}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onLockTask={handleLockTask}
          navigate={navigate}
        />
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

export default ViewTasks;
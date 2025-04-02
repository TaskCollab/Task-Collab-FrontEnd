import React, { useState, useEffect } from 'react';
import {Box, Button, Typography, Skeleton, Snackbar, TextField,
  FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import { UsersAPI } from '../../API/UsersAPICall';
import CreateTask from './CreateTask';
import { useNavigate, Link } from 'react-router-dom';

const ViewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  const statusOptions = ['Open', 'In Progress', 'Completed'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskAPI.getUserTasks();
        const formattedTasks = data.map((task: any) => ({
          id: task.id.toString(),
          title: task.taskTitle,
          description: task.description,
          assignee: task.assignedTo.toString(),
          dueDate: task.deadline.split('T')[0],
          priority: task.priority,
          status: task.status,
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

    const fetchUsers = async () => {
      try {
        const users = await UsersAPI.getAllUsers();
        setUserOptions(users.map((u: any) => u.username));
      } catch (error) {
        console.error('Failed to load users');
      }
    };

    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...tasks];

    if (keyword.trim() !== '') {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(lowerKeyword) ||
        task.description?.toLowerCase().includes(lowerKeyword)
      );
    }

    if (filterStatus) {
      result = result.filter(task => task.status === filterStatus);
    }
    if (filterPriority) {
      result = result.filter(task => task.priority === filterPriority);
    }
    if (filterAssignee) {
      result = result.filter(task => task.assignee === filterAssignee);
    }
    if (filterDate) {
      const selectedDateStr = filterDate.toISOString().split('T')[0];
      result = result.filter(task => task.dueDate === selectedDateStr);
    }

    setFilteredTasks(result);
  }, [tasks, keyword, filterStatus, filterPriority, filterAssignee, filterDate]);

  const handleUpdateTask = async (updatedTask: any) => {
    try {
      const updateData = {
        taskTitle: updatedTask.title,
        assignedTo: updatedTask.assignee,
        deadline: `${updatedTask.dueDate}T23:59:59`,
        status: updatedTask.status,
        priority: updatedTask.priority,
      };
      await TaskAPI.updateTask(parseInt(updatedTask.id), updateData);
      const updatedList = tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedList);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(parseInt(taskId));
      const updatedList = tasks.filter(task => task.id !== taskId);
      setTasks(updatedList);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleLockTask = async (taskId: string) => {
    try {
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? { ...task, locked: !task.locked } : task))
      );
    } catch (error) {
      console.error('Error locking task:', error);
      setError('Failed to toggle lock status');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 500, color: 'primary.main' }}>
          Task Management
        </Typography>
        <Box>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              component={Link}
              to="/manage-users"
              sx={{ textTransform: 'none', borderRadius: 2, py: 1, px: 3, mr: 2 }}
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
        onTaskCreated={(newTaskRaw) => {
          const newTask = {
            id: newTaskRaw.id.toString(),
            title: newTaskRaw.taskTitle,
            description: newTaskRaw.description,
            assignee: newTaskRaw.assignedTo.toString(),
            dueDate: newTaskRaw.deadline.split('T')[0],
            priority: newTaskRaw.priority,
            status: newTaskRaw.status,
            locked: false,
          };
          const updated = [newTask, ...tasks];
          setTasks(updated);
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
            <TextField
              placeholder="Search tasks..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              variant="outlined"
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                <MenuItem value="">All Statuses</MenuItem>
                {statusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={filterPriority} label="Priority" onChange={(e) => setFilterPriority(e.target.value)}>
                <MenuItem value="">All Priorities</MenuItem>
                {priorityOptions.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Assignee</InputLabel>
              <Select value={filterAssignee} label="Assignee" onChange={(e) => setFilterAssignee(e.target.value)}>
                <MenuItem value="">All Users</MenuItem>
                {userOptions.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </Select>
            </FormControl>
            <DatePicker
              label="Due Date"
              value={filterDate}
              onChange={(newVal) => setFilterDate(newVal)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </Box>

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

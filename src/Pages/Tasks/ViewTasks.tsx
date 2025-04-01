import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Skeleton, Snackbar, TextField } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import CreateTask from './CreateTask';
import { useNavigate, Link } from 'react-router-dom';

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchAssignee, setSearchAssignee] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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

  useEffect(() => {
    const titleFilter = searchTitle.toLowerCase();
    const assigneeFilter = searchAssignee.toLowerCase();
    const statusFilter = searchStatus.toLowerCase();

    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(titleFilter) &&
      task.assignee.toLowerCase().includes(assigneeFilter) &&
      task.status.toLowerCase().includes(statusFilter)
    );

    setFilteredTasks(filtered);
  }, [searchTitle, searchAssignee, searchStatus, tasks]);

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  const handleAssigneeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAssignee(e.target.value);
  };

  const handleStatusSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStatus(e.target.value);
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
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(parseInt(taskId));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleLockTask = async (taskId: string) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, locked: !task.locked } : task
        )
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
        onTaskCreated={(newTaskRaw) => {
          const newTask: Task = {
            id: newTaskRaw.id.toString(),
            title: newTaskRaw.taskTitle,
            assignee: newTaskRaw.assignedTo.toString(),
            dueDate: newTaskRaw.deadline.split('T')[0],
            priority: newTaskRaw.priority as 'High' | 'Medium' | 'Low',
            status: newTaskRaw.status as 'Open' | 'In Progress' | 'Completed',
            locked: false,
          };
          setTasks((prev) => [newTask, ...prev]);
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
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search by Title"
              variant="outlined"
              size="small"
              value={searchTitle}
              onChange={handleTitleSearch}
              sx={{ width: 300 }}
            />
            <TextField
              label="Search by Assignee"
              variant="outlined"
              size="small"
              value={searchAssignee}
              onChange={handleAssigneeSearch}
              sx={{ width: 300 }}
            />
            <TextField
              label="Search by Status"
              variant="outlined"
              size="small"
              value={searchStatus}
              onChange={handleStatusSearch}
              sx={{ width: 300 }}
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

// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import CreateTask from '../../Pages/Tasks/CreateTask';
import { createTask } from '../../API/HeaderAPICall';
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

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const isAdmin = true; 

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleTaskCreated = async (newTask: any) => {
    try {
      const deadlineDate = new Date(newTask.deadline).toISOString();
      await createTask({
        taskTitle: newTask.taskTitle,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        status: newTask.status,
        deadline: deadlineDate,
      });
      setTasks((prev) => [newTask, ...prev] as Task[]);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
        </Typography>

        <Button color="inherit" onClick={handleOpenCreateDialog}>New Task</Button>

        {isAdmin && ( // Keep Manage Users button always visible, as isAdmin is hardcoded
          <Button color="inherit" component={Link} to="/manage-users">
            Manage Users
          </Button>
        )}
      </Toolbar>

      <CreateTask
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={handleTaskCreated}
        isAdmin={isAdmin}
      />
    </AppBar>
  );
};

export default Header;

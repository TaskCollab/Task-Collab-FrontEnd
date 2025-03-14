// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import CreateTask from '../../Pages/tasks/CreateTask'; // Import your CreateTask component
import { createTask } from '../../API/HeaderAPICall'; // Assuming you still need createTask


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
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize tasks state if needed
  const isAdmin = true; // Or get isAdmin from your context/props

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleTaskCreated = async (newTask: any) => { // Assuming you have a type for newTask
    try {
      const deadlineDate = new Date(newTask.deadline).toISOString();
      await createTask({
        taskTitle: newTask.taskTitle,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        status: newTask.status,
        deadline: deadlineDate,
      });
      setTasks((prev) => [newTask, ...prev] as Task[]); // Update tasks state
      setCreateDialogOpen(false); // Close modal
      // Optionally, refresh task list or show success message
    } catch (error) {
      console.error('Error creating task:', error);
      // Show error message
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
        </Typography>
        <Button color="inherit" onClick={handleOpenCreateDialog}>New Task</Button>
      </Toolbar>

      <CreateTask
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={handleTaskCreated} // Use your modified function
        isAdmin={isAdmin}
      />
    </AppBar>
  );
};

export default Header;
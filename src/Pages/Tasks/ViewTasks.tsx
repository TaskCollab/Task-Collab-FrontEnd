import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Skeleton, Snackbar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskAPI.getUserTasks();
        //Map API to local tasks format
        const formattedTasks = data.map((task: { id: { toString: () => any; }; taskTitle: any; assignedTo: { toString: () => any; }; deadline: string; priority: string; status: string; }) => ({
          id: task.id.toString(),
          title: task.taskTitle,
          assignee: task.assignedTo.toString(), //fetch user name from another API
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
  }, []);
  
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
        
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<GroupIcon />}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              py: 1,
              px: 3
            }}
          >
            Manage Users
          </Button>
        )}
      </Box>

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
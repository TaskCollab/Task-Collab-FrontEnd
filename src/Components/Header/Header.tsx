// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, 
  Button, Badge, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CreateTask from '../../Pages/Tasks/CreateTask';
import { createTask } from '../../API/HeaderAPICall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationAPI } from '../../API/NotificationAPICall';
import { Notification } from '../../Utils/NotificationTypes';
import { jwtDecode } from 'jwt-decode';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = true; 

  const getUserId = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    interface JwtPayload {
      userId: string;
    }
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId;
  };

  const fetchNotifications = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      
      const data = await NotificationAPI.getUnreadNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.readStatus).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await NotificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.notificationId === notificationId ? {...n, readStatus: true} : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
        <Box sx={{ flexGrow: 1 }} />

        <IconButton 
          size="large"
          color="inherit"
          onClick={handleNotificationOpen}
          sx={{ mr: 2 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
        </Typography>

        <Button color="inherit" onClick={handleOpenCreateDialog}>New Task</Button>

        {isAdmin && (
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.notificationId}
              onClick={() => {
                handleMarkAsRead(notification.notificationId);
                handleNotificationClose();
              }}
              sx={{
                py: 1.5,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                '&:last-child': { borderBottom: 0 }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: notification.readStatus ? 400 : 600,
                    color: notification.readStatus ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {notification.notificationTitle}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {notification.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.disabled"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
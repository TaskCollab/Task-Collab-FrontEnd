import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import TaskRow from './TaskRow';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
}

interface TasksTableProps {
  tasks: Task[];
  isAdmin: boolean;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onLockTask: (taskId: string) => void;
  navigate: (path: string) => void; // Add navigate prop
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  isAdmin,
  onUpdateTask,
  onDeleteTask,
  onLockTask,
  navigate, // Destructure navigate prop
}) => {
  const isEmpty = tasks.length === 0;

  const handleTitleClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table aria-label="tasks table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Assignee</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">
                  No tasks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Typography
                    onClick={() => handleTitleClick(task.id)}
                    style={{ cursor: 'pointer' }} // Add pointer cursor
                  >
                    {task.title}
                  </Typography>
                </TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <TaskRow
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                    onLock={onLockTask}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(TasksTable);
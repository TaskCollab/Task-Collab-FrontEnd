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
} from '@mui/material';
import TaskRow from './TaskRow';
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
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  isAdmin,
  onUpdateTask,
  onDeleteTask,
  onLockTask,
}) => {
  const isEmpty = tasks.length === 0;

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
              <TaskRow
                key={task.id}
                task={task}
                isAdmin={isAdmin}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onLock={onLockTask}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(TasksTable);
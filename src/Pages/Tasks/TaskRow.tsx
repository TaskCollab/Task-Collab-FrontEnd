import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Lock, LockOpen, Save, Cancel } from '@mui/icons-material';
import usePermissions from '../../Utils/usePermissions'; // Import your permissions hook

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
}

interface TaskRowProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onLock: (taskId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onUpdate, onDelete, onLock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const permissions: string[] = usePermissions();

  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    onUpdate(editedTask);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editedTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
          />
        ) : (
          task.title
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editedTask.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            fullWidth
          />
        ) : (
          task.assignee
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            fullWidth
          />
        ) : (
          task.dueDate
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            fullWidth
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        ) : (
          task.priority
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.status}
            onChange={(e) => handleChange('status', e.target.value)}
            fullWidth
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        ) : (
          task.status
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <>
            {permissions.includes('UPDATE') && (
              <IconButton onClick={saveChanges} color="primary">
                <Save />
              </IconButton>
            )}
            <IconButton onClick={cancelEdit} color="secondary">
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            {permissions.includes('UPDATE') && (
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <Edit />
              </IconButton>
            )}
            {permissions.includes('DELETE') && (
              <IconButton onClick={() => onDelete(task.id)} color="secondary">
                <Delete />
              </IconButton>
            )}
            {permissions.includes('ADMIN') && (
              <IconButton onClick={() => onLock(task.id)} color="default">
                {task.locked ? <Lock /> : <LockOpen />}
              </IconButton>
            )}
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
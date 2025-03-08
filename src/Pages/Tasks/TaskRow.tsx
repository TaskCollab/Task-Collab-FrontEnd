import React, { useState } from 'react';

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
  isAdmin: boolean;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onLock: (taskId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, isAdmin, onUpdate, onDelete, onLock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => { //we need to establish a try-catch method here, and implement API method inside this.
    setIsEditing(false);
    onUpdate(editedTask);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  return (
    <tr>
      <td>{isEditing ? <input type="text" value={editedTask.title} onChange={(e) => handleChange('title', e.target.value)} /> : task.title}</td>
      <td>{isEditing ? <input type="text" value={editedTask.assignee} onChange={(e) => handleChange('assignee', e.target.value)} /> : task.assignee}</td>
      <td>{isEditing ? <input type="date" value={editedTask.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} /> : task.dueDate}</td>
      <td>
        {isEditing ? (
          <select value={editedTask.priority} onChange={(e) => handleChange('priority', e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        ) : task.priority}
      </td>
      <td>
        {isEditing ? (
          <select value={editedTask.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        ) : task.status}
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={saveChanges}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
            {isAdmin && (
              <button onClick={() => onLock(task.id)}>
                {task.locked ? 'Unlock' : 'Lock'}
              </button>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

export default TaskRow; //I did not do any unit testing yet, but I will do it soon.
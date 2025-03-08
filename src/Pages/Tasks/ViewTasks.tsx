import React, { useState, useEffect } from 'react';
import TasksTable from './TasksTable'; 
import './ViewTasks.css';

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

  useEffect(() => {
//Waiting for API integration.
//if you guys have API completed, place it here, then we can start enterning information here.
//The tasks below here is only an example
    setTasks([
      { id: '1', title: 'Task A', assignee: 'Kevin Zhang', dueDate: '2025-03-10', priority: 'High', status: 'Open', locked: false },
      { id: '2', title: 'Task B', assignee: 'Vu Drudh', dueDate: '2025-03-12', priority: 'Medium', status: 'In Progress', locked: false }
    ]);
  }, []);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleLockTask = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, locked: !task.locked } : task));
  };

  return (
    <div className="view-tasks">
      <h1>Tasks</h1>
      {isAdmin && <button className="manage-users-btn">Manage Users</button>}
      <TasksTable tasks={tasks} isAdmin={isAdmin} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onLockTask={handleLockTask} />
    </div>
  );
};

export default ViewTasks;

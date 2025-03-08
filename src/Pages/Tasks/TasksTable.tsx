    import React from 'react';
    import TaskRow from './TaskRow';
    import './ViewTasks.css';

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

    const TasksTable: React.FC<TasksTableProps> = ({ tasks, isAdmin, onUpdateTask, onDeleteTask, onLockTask }) => (
    <table className="tasks-table">
        <thead>
        <tr>
            <th>Task</th>
            <th>Assignee</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {tasks.map(task => (
            <TaskRow key={task.id} task={task} isAdmin={isAdmin} onUpdate={onUpdateTask} onDelete={onDeleteTask} onLock={onLockTask} />
        ))}
        </tbody>
    </table>
    );

    export default TasksTable;

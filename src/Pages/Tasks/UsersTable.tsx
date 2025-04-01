import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem,
  Button
} from '@mui/material';

interface User {
  userId: number;
  username: string;
  role: string;
  isAdmin: boolean;
}

interface UsersTableProps {
  users: Array<{
    userId: number;
    username: string;
    role: string;
    isAdmin: boolean;
  }>;
  roles: string[];
  onUpdateRole: (userId: number, newRole: string) => void;
  onDelete: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  roles,
  onUpdateRole,
  onDelete 
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Update Role</TableCell>
            <TableCell>Admin Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.userId}>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onChange={(e) => onUpdateRole(user.userId, e.target.value)}
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button 
                  color="error"
                  onClick={() => onDelete(user.userId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
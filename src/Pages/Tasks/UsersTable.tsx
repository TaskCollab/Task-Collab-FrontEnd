import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import UserRow from './UserRow';

interface RoleType {
  roleId: number;
  roleName: string;
}
interface UserType {
  userId: number;
  username: string;
  isAdmin?: boolean;
  role: RoleType;
}

interface UsersTableProps {
  users: UserType[];
  roles: RoleType[];
  onUpdateRole: (userId: number, newRoleId: number) => void;
  onDelete: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, roles, onUpdateRole, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Username</strong></TableCell>
            <TableCell><strong>Role</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <UserRow 
              key={user.userId} 
              user={user} 
              roles={roles} 
              onUpdateRole={onUpdateRole} 
              onDelete={onDelete} 
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;

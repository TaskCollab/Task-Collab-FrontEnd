import React from 'react';
import { TableRow, TableCell, Select, MenuItem, IconButton, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Assume RoleType and UserType are defined elsewhere
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

interface UserRowProps {
  user: UserType;
  roles: RoleType[];
  onUpdateRole: (userId: number, newRoleId: number) => void;
  onDelete: (userId: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, roles, onUpdateRole, onDelete }) => {
  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const newRoleId = Number(event.target.value); // Ensure conversion to number
    onUpdateRole(user.userId, newRoleId);
  };

  return (
    <TableRow hover key={user.userId}>
      <TableCell>{user.username}</TableCell>
      <TableCell>
        <Select 
          value={user.role.roleId} 
          onChange={handleRoleChange} 
          size="small"
        >
          {roles.map(role => (
            <MenuItem key={role.roleId} value={role.roleId}>
              {role.roleName}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell align="right">
        <IconButton 
          aria-label="Delete User" 
          color="error" 
          size="small" 
          onClick={() => onDelete(user.userId)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;

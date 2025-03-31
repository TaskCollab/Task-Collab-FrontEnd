import React, {memo} from 'react';
import { TableRow, TableCell, Select, MenuItem, IconButton, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


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
    const newRoleId = Number(event.target.value);
    onUpdateRole(user.userId, newRoleId);
  };

  // Debugging logs to check values
  console.log("user.role.roleId:", user.role.roleId);
  console.log("roles:", roles);

  return (
    <TableRow hover key={user.userId}>
      <TableCell>{user.username}</TableCell>
      <TableCell>
        <Select 
          value={user.role.roleId}  // Ensure this is a number matching the roleId in the MenuItems
          onChange={handleRoleChange} 
          size="small"
        >
          {roles.map(role => {
            console.log("roles.map() role:", role);  // Log the role to check for duplicates
            return (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            );
          })}
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

export default memo(UserRow, (prevProps, nextProps) => {
  return prevProps.user.role.roleId === nextProps.user.role.roleId &&
         prevProps.roles === nextProps.roles;
}); //code refactoring

//i have implement memoization for code refactoring, improve perfoemances.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { UsersAPI } from '../../API/UsersAPICall';
import { RoleDTO } from '../../API/UsersAPICall';
import { convertRoleDTO, Role } from '../Landing/roleTypes';


const RoleManagementModal: React.FC<{ 
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UsersAPI.getAllRoles();
      setRoles(data.map(convertRoleDTO));
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    
    try {
      await UsersAPI.createRole({
        roleName: newRoleName.trim(),
        permissions: { create: true, read: true, update: true, delete: true }
      });
      setNewRoleName('');
      await fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    try {
      await UsersAPI.deleteRole(roleName);
      setRoles(prev => prev.filter(r => r.roleName !== roleName));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const renderPermissions = (permissions: Role['permissions']) => {
    return Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([perm]) => perm)
      .join(', ') || 'No permissions';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Role Management</DialogTitle>
      
      <DialogContent>
        <RoleCreationForm
          newRoleName={newRoleName}
          onRoleNameChange={setNewRoleName}
          onCreate={handleCreateRole}
        />

        {isLoading ? (
          <div>Loading roles...</div>
        ) : (
          <RolesTable
            roles={roles}
            onDeleteRole={handleDeleteRole}
            renderPermissions={renderPermissions}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Extracted sub-components
const RoleCreationForm: React.FC<{
  newRoleName: string;
  onRoleNameChange: (value: string) => void;
  onCreate: () => void;
}> = ({ newRoleName, onRoleNameChange, onCreate }) => (
  <div className="role-creation-form">
    <TextField
      label="New Role Name"
      value={newRoleName}
      onChange={(e) => onRoleNameChange(e.target.value)}
      fullWidth
      margin="normal"
    />
    <Button 
      variant="contained" 
      onClick={onCreate}
      disabled={!newRoleName.trim()}
    >
      Create Role
    </Button>
  </div>
);

const RolesTable: React.FC<{
  roles: Role[];
  onDeleteRole: (roleName: string) => void;
  renderPermissions: (permissions: Role['permissions']) => string;
}> = ({ roles, onDeleteRole, renderPermissions }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Role Name</TableCell>
          <TableCell>Permissions</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.roleName}>
            <TableCell>{role.roleName}</TableCell>
            <TableCell>{renderPermissions(role.permissions)}</TableCell>
            <TableCell>
              <Button 
                color="error" 
                onClick={() => onDeleteRole(role.roleName)}
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

export default RoleManagementModal;
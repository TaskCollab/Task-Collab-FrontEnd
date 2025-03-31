import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Checkbox, FormControlLabel
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
  const [newRolePermissions, setNewRolePermissions] = useState({
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: true,
  });

  const fetchRoles = useCallback(async () => {
    try {
      const data = await UsersAPI.getAllRoles();
      setRoles(data.map(convertRoleDTO));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }, []);

  useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const roleDTO = {
        roleName: newRoleName,
        createPermission: newRolePermissions.createPermission,
        readPermission: newRolePermissions.readPermission,
        updatePermission: newRolePermissions.updatePermission,
        deletePermission: newRolePermissions.deletePermission,
      };

      await UsersAPI.createRole(roleDTO);

      setNewRoleName('');
      setNewRolePermissions({ createPermission: true, readPermission: true, updatePermission: true, deletePermission: true }); // Reset permissions
      const updatedRoles = await UsersAPI.getAllRoles();
      setRoles(updatedRoles);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <TextField
            label="New Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            fullWidth
          />
          <div>
            <FormControlLabel
              control={<Checkbox checked={newRolePermissions.createPermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, createPermission: e.target.checked })} />}
              label="Create"
            />
            <FormControlLabel
              control={<Checkbox checked={newRolePermissions.readPermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, readPermission: e.target.checked })} />}
              label="Read"
            />
            <FormControlLabel
              control={<Checkbox checked={newRolePermissions.updatePermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, updatePermission: e.target.checked })} />}
              label="Update"
            />
            <FormControlLabel
              control={<Checkbox checked={newRolePermissions.deletePermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, deletePermission: e.target.checked })} />}
              label="Delete"
            />
          </div>
          <Button variant="contained" onClick={handleCreateRole}>
            Create Role
          </Button>
        </div>

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
                  <TableCell>
                    {role.permissions && Object.entries(role.permissions)
                      .filter(([_, value]) => value)
                      .map(([perm]) => perm).join(', ')}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={async () => {
                        await UsersAPI.deleteRole(role.roleName);
                        setRoles(prev => prev.filter(r => r.roleName !== role.roleName));
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleManagementModal;
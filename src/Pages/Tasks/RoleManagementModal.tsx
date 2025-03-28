import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { UsersAPI } from '../../API/UsersAPICall';

interface Role {
  roleName: string;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

const RoleManagementModal: React.FC<{ 
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await UsersAPI.getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    if(open) fetchRoles();
  }, [open]);

  const handleCreateRole = async () => {
    if (!newRoleName) return;
    try {
      await UsersAPI.createRole({
        roleName: newRoleName,
        permissions: { create: true, read: true, update: true, delete: true }
      });
      setNewRoleName('');
      const updatedRoles = await UsersAPI.getAllRoles();
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Role Management</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <TextField
            label="New Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            fullWidth
          />
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
                    {Object.entries(role.permissions)
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
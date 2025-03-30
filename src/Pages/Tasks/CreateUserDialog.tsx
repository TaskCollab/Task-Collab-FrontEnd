import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (userData: { username: string; password: string; role: number }) => void;
  roles: Array<{ roleId: number; roleName: string }>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ 
  open, 
  onClose, 
  onCreate,
  roles 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  
  const handleSubmit = () => {
    if (!selectedRoleId) {
      alert("Role is required");
      return;
    }
    onCreate({ username, password, role: selectedRoleId }); 
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRoleId || ""}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            label="Role"
          >
            {roles.map((role) => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={!username || !password || !selectedRoleId}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
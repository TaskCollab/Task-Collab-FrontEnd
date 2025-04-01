import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import UsersTable from './UsersTable';
import GenericModal from '../../Components/Modal/GenericModal';
import { UsersAPI } from '../../API/UsersAPICall';
import { UserDTO } from '../../API/UsersAPICall';
import RoleManagementModal from './RoleManagementModal';
import AddIcon from '@mui/icons-material/Add';
import ManageRolesIcon from '@mui/icons-material/AssignmentInd';
import CreateUserDialog from './CreateUserDialogue'; 

interface RoleType {
  roleName: string;
}

interface UserType {
  userId: number;
  username: string;
  isAdmin: boolean; 
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [roleObjects, setRoleObjects] = useState<{ roleId: number; roleName: string }[]>([]); // New state for role objects
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleManagementOpen, setRoleManagementOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          UsersAPI.getAllUsers(),
          UsersAPI.getAllRoles()
        ]);

        const formattedUsers = usersData.map((user: UserDTO) => ({
          userId: Number(user.userId),
          username: user.username,
          isAdmin: user.role === 'ADMIN',
          role: user.role
        }));
  
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        setRoles(rolesData.map((r: any)=>r.roleName ));
        setRoleObjects(rolesData.map((r: any) => ({ roleId: r.roleId, roleName: r.roleName }))); // Set role objects
       } catch (error) {
        setError('Failed to load users');
        console.error('Failed to fetch users:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(user => 
        user.username.toLowerCase().includes(query)
      )
    );
  };

  const handleUpdateRole = async (userId: number, newRoleName: string) => {
    try {
      await UsersAPI.updateUserRole(userId.toString(), newRoleName);
      setUsers(prevUsers => prevUsers.map(u =>u.userId === userId ? { ...u, role: newRoleName } : u
        )
      );
    } catch (error) {
      setError('Failed to update user role');
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteClick = (userId: number) => {
    const user = users.find(u => u.userId === userId) || null;
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await UsersAPI.deleteUser(userToDelete.userId.toString());
      setUsers(prev => prev.filter(u => u.userId !== userToDelete.userId));
      setFilteredUsers(prev => prev.filter(u => u.userId !== userToDelete.userId));
    } catch (error) {
      setError('Failed to delete user');
      console.error('Failed to delete user:', error);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUserCreated = async (userData: { username: string; password: string; role: number },clearFields: () => void, ) => {
    try {
      await UsersAPI.createUser(userData); // Create the user via API

      const usersData = await UsersAPI.getAllUsers(); // Refresh the user list
      const formattedUsers = usersData.map((user: UserDTO) => ({
        userId: user.userId.toString(),
        username: user.username,
        isAdmin: user.role === 'ADMIN',
        role: user.role
      }));

      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      setCreateUserOpen(false); // Close the modal
      clearFields(); // Clear the fields
    } catch (error) {
      setError('Failed to create user');
      console.error('Failed to create user:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ManageRolesIcon />}
          onClick={() => setRoleManagementOpen(true)}
          sx={{ textTransform: 'none' }}
        >
          Manage Roles
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateUserOpen(true)}
          sx={{ textTransform: 'none' }}
        >
          New User
        </Button>
      </Box>

      <TextField 
        label="Search Users" 
        variant="outlined" 
        size="small" 
        value={searchQuery} 
        onChange={handleSearchChange} 
        sx={{ mb: 2, width: '100%', maxWidth: 400 }}
      />

      <UsersTable 
        users={filteredUsers} 
        roles={roles} 
        onUpdateRole={handleUpdateRole} 
        onDelete={handleDeleteClick} 
      />

      <RoleManagementModal 
        open={roleManagementOpen}
        onClose={() => setRoleManagementOpen(false)}
      />

      <GenericModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user "${userToDelete?.username}"?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CreateUserDialog // Use your CreateUserDialog component
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleUserCreated} // Pass the modified handleUserCreated function
        roles={roleObjects} // Pass the role objects
      />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ManageUsers;
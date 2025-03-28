import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import UsersTable from './UsersTable';
import GenericModal from '../../Components/Modal/GenericModal';
import { UsersAPI } from '../../API/UsersAPICall';
import { UserDTO } from '../../API/UsersAPICall';

interface RoleType {
  roleName: string;
}

interface UserType {
  userId: string;
  username: string;
  isAdmin: boolean; 
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await UsersAPI.getAllUsers();
        
        const formattedUsers = usersData.map((user: UserDTO) => ({
          userId: user.userId.toString(),
          username: user.username,
          isAdmin: user.role === 'ADMIN',
          role: user.role
        }));
  
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        const uniqueRoles = Array.from(
          new Set<string>(
            formattedUsers.map((u: { role: { roleName: string } }) => u.role.roleName)
          )
        );        
        setRoles(uniqueRoles);
        
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

  const handleUpdateRole = async (userId: string, newRoleName: string) => {
    try {
      await UsersAPI.updateUserRole(userId, newRoleName);
      setUsers (prevUsers => prevUsers.map(u => u.userId === userId ? { ...u, role: newRoleName } : u ));
    } catch (error) {
      setError('Failed to update user role');
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteClick = (userId: string) => {
    const user = users.find(u => u.userId === userId) || null;
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await UsersAPI.deleteUser(userToDelete.userId);
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>
      
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

      <GenericModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user "${userToDelete?.username}"?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
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
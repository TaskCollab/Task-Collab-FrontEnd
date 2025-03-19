import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import UsersTable from './UsersTable';
import GenericModal from '../../Components/Modal/GenericModal';
import { getUsers, updateUserRole, deleteUser } from '../../API/UsersAPICall';


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

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  useEffect(() => {
    // Fetch users (and possibly roles) when component mounts
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
        // Derive list of roles from users data (assuming each user has a role object)
        const allRoles = usersData.map(u => u.role);
        // Remove duplicate roles by ID
        const uniqueRoles = allRoles.filter(
          (role, index, self) => role && self.findIndex(r => r.roleId === role.roleId) === index
        );
        setRoles(uniqueRoles);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (!query) {
      setFilteredUsers(users);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(lowerQuery)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUpdateRole = async (userId: number, newRoleId: number) => {
    try {
      await updateUserRole(userId, newRoleId);
      // Update the user's role in state
      setUsers(prevUsers => prevUsers.map(u => 
        u.userId === userId ? { ...u, role: roles.find(r => r.roleId === newRoleId)! } : u
      ));
      setFilteredUsers(prevUsers => prevUsers.map(u => 
        u.userId === userId ? { ...u, role: roles.find(r => r.roleId === newRoleId)! } : u
      ));
    } catch (error) {
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
      await deleteUser(userToDelete.userId);
      // Remove the deleted user from state
      setUsers(prev => prev.filter(u => u.userId !== userToDelete.userId));
      setFilteredUsers(prev => prev.filter(u => u.userId !== userToDelete.userId));
    } catch (error) {
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
      {/* UsersTable displays the list of users and actions */}
      <UsersTable 
        users={filteredUsers} 
        roles={roles} 
        onUpdateRole={handleUpdateRole} 
        onDelete={handleDeleteClick} 
      />
      {/* GenericModal for delete confirmation */}
      <GenericModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user "${userToDelete?.username}"?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default ManageUsers;

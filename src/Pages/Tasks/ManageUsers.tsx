import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import UsersTable from './UsersTable';
import GenericModal from '../../Components/Modal/GenericModal';
import { UsersAPI } from '../../API/UsersAPICall';
import { UserDTO } from '../../API/UsersAPICall';
import RoleManagementModal from './RoleManagementModal';
import AddIcon from '@mui/icons-material/Add';
import ManageRolesIcon from '@mui/icons-material/AssignmentInd';
import CreateUserDialog from './CreateUserDialog';

interface UserType {
  userId: number;
  username: string;
  isAdmin: boolean;
  role: string;
}
interface RoleType {
  roleId: number;
  roleName: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
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

        const formattedRoles = rolesData.map((role: any) => ({
          roleId: role.roleId,
          roleName: role.roleName
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        setRoles(formattedRoles);
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

  const handleCreateUser = async (userData: { 
    username: string; 
    password: string; 
    role: number 
  }) => {
    try {
      const createdUser = await UsersAPI.createUser({
        username: userData.username,
        password: userData.password,
        role: roles.find(r => r.roleId === userData.role)?.roleName || ''
      });

      setUsers(prev => [...prev, {
        userId: Number(createdUser.userId),
        username: createdUser.username,
        isAdmin: createdUser.role === 'ADMIN',
        role: createdUser.role
      }]);
      
      setCreateUserOpen(false);
    } catch (error) {
      setError('Failed to create user');
      console.error('User creation failed:', error);
    }
  };

  const handleUpdateRole = async (userId: number, newRoleName: string) => {
    try {
      const allRoles = await UsersAPI.getAllRoles();
      const targetRole = allRoles.find(role => role.roleName === newRoleName);
      if (!targetRole) throw new Error("Role not found");
      
      await UsersAPI.updateUserRole(userId.toString(), targetRole);
      
      const updatedUsers = await UsersAPI.getAllUsers();
      setUsers(updatedUsers.map((u: UserDTO) => ({
        userId: Number(u.userId),
        username: u.username,
        isAdmin: u.role === 'ADMIN',
        role: u.role
      })));
    } catch (error) {
      console.error("Failed to update role:", error);
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
      console.error('Failed to delete user', error);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };
  const formattedRolesForTable = roles.map(r => r.roleName);
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

      <CreateUserDialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleCreateUser}
        roles={roles}
      />

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
        roles={formattedRolesForTable}
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

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ManageUsers;
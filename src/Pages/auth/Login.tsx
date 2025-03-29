import React, { FormEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { login } from '../../API/AuthAPICall';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage('Please fill in all fields');
      setIsError(true);
      setOpenSnackbar(true);
      return;
    }

    try {
      await login(username, password);
      setMessage('Login successful!');
      setIsError(false);
      setOpenSnackbar(true);
      navigate('/home');
    } catch (error) {
      let errorMessage = 'An error occurred during login';
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        errorMessage = (axiosError.response?.data as { message?: string })?.message || axiosError.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setIsError(true);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username/Email"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={isError ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Login;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom';
import { loginAsync } from '../../store/authSlice';
import { initializeUserTasks } from '../../store/taskSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginAsync(formData));
      if (loginAsync.fulfilled.match(resultAction)) {
        dispatch(initializeUserTasks(formData.email));
        navigate('/');
      }
    } catch (err) {
      setErrors({
        ...errors,
        general: 'Login failed. Please try again.'
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h5" component="h1" align="center">
            Login
          </Typography>

          {errors.general && (
            <Alert severity="error">{errors.general}</Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <MuiLink component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
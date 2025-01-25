import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearTasks } from '../../store/taskSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearTasks());
    dispatch(logout());
    navigate('/signup');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            flexGrow: 1 
          }}
          onClick={handleLogoClick}
        >
          <FormatListBulletedIcon sx={{ 
            mr: 1,
            fontSize: '2rem',
            color: 'white'
          }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 500,
              color: 'white',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            Todo App
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: 'inherit'
          }}>
            <PersonIcon />
            {!isMobile && (
              <Typography variant="body1">
                {user?.username || 'User'}
              </Typography>
            )}
          </Box>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {!isMobile && 'Logout'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

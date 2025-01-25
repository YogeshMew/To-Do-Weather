import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import TaskInput from './components/Tasks/TaskInput';
import TaskList from './components/Tasks/TaskList';
import TaskStats from './components/Tasks/TaskStats';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NavBar from './components/Layout/NavBar';
import { useSelector, useDispatch } from 'react-redux';
import { initializeUserTasks } from './store/taskSlice';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/signup" />;
};

const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {isAuthenticated && <NavBar />}
      {children}
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      dispatch(initializeUserTasks(user.username));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <TaskStats />
            <TaskInput />
            <TaskList />
          </Box>
        </Container></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Layout>
  );
};

export default App;

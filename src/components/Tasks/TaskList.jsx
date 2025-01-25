import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleTask, 
  deleteTask, 
  updateTaskPriority,
  selectFilteredTasks 
} from '../../store/taskSlice';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  List, 
  Paper 
} from '@mui/material';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';

const TaskList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const { loading } = useSelector(state => state.tasks);
  const tasks = useSelector(selectFilteredTasks);

  const handleToggle = (taskId) => {
    if (currentUser?.email) {
      dispatch(toggleTask({ userId: currentUser.email, taskId }));
    }
  };

  const handleDelete = (taskId) => {
    if (currentUser?.email) {
      dispatch(deleteTask({ userId: currentUser.email, taskId }));
    }
  };

  const handlePriorityChange = (taskId, priority) => {
    if (currentUser?.email) {
      dispatch(updateTaskPriority({ userId: currentUser.email, taskId, priority }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box my={4}>
        <Typography variant="body1" color="text.secondary" align="center">
          Please log in to view your tasks
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: { xs: '100%', sm: '600px', md: '800px' },
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <TaskFilter />
      
      <Paper 
        elevation={1} 
        sx={{ 
          mt: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {!tasks.length ? (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              p: 4,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            No tasks found
          </Typography>
        ) : (
          <List disablePadding>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onPriorityChange={handlePriorityChange}
              />
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default TaskList;
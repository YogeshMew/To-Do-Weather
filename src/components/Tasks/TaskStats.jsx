import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { isOutdoorTask } from './taskUtils';

const TaskStats = () => {
  const theme = useTheme();
  const currentUser = useSelector(state => state.auth.user);
  const allTasks = useSelector(state => {
    if (!currentUser?.email) return [];
    return state.tasks.tasks[currentUser.email] || [];
  });
  
  // Calculate statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.completed).length;
  
  // Filter out completed tasks for active task counts
  const activeTasks = allTasks.filter(task => !task.completed);
  const activeTaskCount = activeTasks.length;
  
  const outdoorTasks = activeTasks.filter(task => isOutdoorTask(task.title)).length;
  const indoorTasks = activeTaskCount - outdoorTasks;
  const highPriorityTasks = activeTasks.filter(task => task.priority === 'high').length;

  const StatBox = ({ title, value, color }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        backgroundColor: color,
        color: theme.palette.getContrastText(color),
      }}
    >
      <Typography variant="h6" component="div">
        {value}
      </Typography>
      <Typography variant="body2" component="div">
        {title}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="Total Tasks"
            value={totalTasks}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="Completed"
            value={completedTasks}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="Active"
            value={activeTaskCount}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="Indoor"
            value={indoorTasks}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="Outdoor"
            value={outdoorTasks}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatBox
            title="High Priority"
            value={highPriorityTasks}
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskStats;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../store/taskSlice';
import { 
  TextField, 
  Button, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskInput = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [type, setType] = useState('indoor');
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && currentUser?.email) {
      dispatch(addTask({
        userId: currentUser.email,
        task: {
          title: title.trim(),
          priority,
          type,
          completed: false
        }
      }));
      setTitle('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '800px' },
        margin: '0 auto',
        padding: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task"
            size={isMobile ? "small" : "medium"}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            >
              <MenuItem value="indoor">Indoor</MenuItem>
              <MenuItem value="outdoor">Outdoor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!title.trim() || !currentUser?.email}
            size={isMobile ? "small" : "medium"}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskInput;
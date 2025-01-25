import React from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/taskSlice';

const TaskFilter = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state) => state.tasks.filter);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      dispatch(setFilter(newFilter));
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      borderBottom: 1,
      borderColor: 'divider',
      mb: 2
    }}>
      <Tabs
        value={currentFilter}
        onChange={handleFilterChange}
        variant="scrollable"
        scrollButtons={true}
        aria-label="task filter tabs"
        sx={{
          minHeight: { xs: 36, sm: 48 },
          '& .MuiTabs-scrollButtons': {
            display: { xs: 'flex', sm: 'none' }
          },
          '& .MuiTabs-scroller': {
            overflowX: 'auto !important',
            '::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none'
          },
          '& .MuiTabs-flexContainer': {
            gap: { xs: 1, sm: 2 }
          },
          '& .MuiTab-root': {
            minHeight: { xs: 36, sm: 48 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1, sm: 2 },
            minWidth: 'auto',
            textTransform: 'none',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          },
          '& .Mui-selected': {
            fontWeight: 600
          }
        }}
      >
        <Tab 
          label="All Tasks" 
          value="all"
          sx={{ 
            '&.Mui-selected': { color: 'primary.main' }
          }}
        />
        <Tab 
          label="Outdoor" 
          value="outdoor"
          sx={{ 
            '&.Mui-selected': { color: '#2196f3' }
          }}
        />
        <Tab 
          label="Indoor" 
          value="indoor"
          sx={{ 
            '&.Mui-selected': { color: '#757575' }
          }}
        />
        <Tab 
          label="High Priority" 
          value="high"
          sx={{ 
            '&.Mui-selected': { color: '#e53935' }
          }}
        />
        <Tab 
          label="Completed" 
          value="completed"
          sx={{ 
            '&.Mui-selected': { color: '#43a047' }
          }}
        />
      </Tabs>
    </Box>
  );
};

export default TaskFilter;

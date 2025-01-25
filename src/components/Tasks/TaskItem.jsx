import React, { useState, useEffect } from 'react';
import {
  ListItem,
  Checkbox,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { getWeatherData } from '../../services/weatherApi';

const TaskItem = ({ task, onToggle, onDelete, onPriorityChange }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (task.type === 'outdoor') {
        try {
          setLoading(true);
          setError(null);
          const data = await getWeatherData();
          setWeather(data);
        } catch (err) {
          setError('Could not fetch weather data');
          console.error('Weather fetch error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeather();
  }, [task.type]);

  const handlePriorityChange = (event) => {
    onPriorityChange(task.id, event.target.value);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e53935';
      case 'medium':
        return '#fb8c00';
      case 'low':
        return '#43a047';
      default:
        return '#757575';
    }
  };

  const getWeatherIcon = (temp) => {
    if (temp === '--') return <CloudIcon />;
    if (temp <= 0) return <AcUnitIcon />;
    if (temp <= 15) return <CloudIcon />;
    return <WbSunnyIcon />;
  };

  const renderWeatherInfo = () => {
    if (loading) {
      return <CircularProgress size={20} />;
    }
    if (error) {
      return (
        <Tooltip title={error}>
          <Typography variant="caption" color="error">
            Weather unavailable
          </Typography>
        </Tooltip>
      );
    }
    if (weather) {
      return (
        <Tooltip title={`${weather.description} in ${weather.locationName}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getWeatherIcon(weather.temperature)}
            <Typography variant="body2">
              {weather.temperature === '--' ? 'N/A' : `${weather.temperature}°C`}
            </Typography>
          </Box>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <ListItem
      disablePadding
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: { xs: 1, sm: 2 },
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        width: '100%',
        alignItems: 'flex-start',
        gap: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 }
      }}>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          disableRipple
          sx={{ mt: 0.5 }}
        />
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.5, sm: 1 },
          flex: 1,
          minWidth: 0
        }}>
          <Typography 
            sx={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.7 : 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            {task.title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            flexWrap: 'wrap', 
            alignItems: 'center'
          }}>
            <Chip 
              label={task.type}
              size="small"
              sx={{ 
                bgcolor: task.type === 'outdoor' ? '#2196f3' : '#e0e0e0',
                color: task.type === 'outdoor' ? '#fff' : 'text.primary',
                borderRadius: 1,
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '0.75rem'
                }
              }}
            />
            <Chip
              label={task.priority}
              size="small"
              sx={{
                bgcolor: getPriorityColor(task.priority),
                color: '#fff',
                borderRadius: 1,
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '0.75rem'
                }
              }}
            />
            {task.completed && (
              <Chip
                label="Completed"
                size="small"
                sx={{
                  bgcolor: '#43a047',
                  color: '#fff',
                  borderRadius: 1,
                  height: 20,
                  display: { xs: 'flex', sm: 'none' },
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem'
                  }
                }}
              />
            )}
            {task.type === 'outdoor' && weather && (
              <Box sx={{ 
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center',
                gap: 0.5,
                ml: 'auto',
                color: '#FB8C00'
              }}>
                {getWeatherIcon(weather?.temperature)}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {weather?.temperature}°C
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: { xs: 0.5, sm: 2 },
          ml: { xs: 0.5, sm: 2 },
          flexShrink: 0
        }}>
          {task.type === 'outdoor' && (
            <Box sx={{ 
              minWidth: { sm: 80 },
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1
            }}>
              {renderWeatherInfo()}
            </Box>
          )}
          
          <Select
            size="small"
            value={task.priority}
            onChange={handlePriorityChange}
            sx={{ 
              minWidth: { xs: 75, sm: 100 },
              height: { xs: 32, sm: 40 },
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: getPriorityColor(task.priority)
              },
              '.MuiSelect-select': {
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }
            }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>

          <IconButton 
            edge="end" 
            aria-label="delete"
            onClick={() => onDelete(task.id)}
            sx={{ 
              color: '#e53935',
              p: { xs: 0.25, sm: 1 }
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
};

export default TaskItem;

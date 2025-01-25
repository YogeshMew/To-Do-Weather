// Note: This should be in src/utils/taskUtils.js, not in components/Tasks/

// Function to check if a task is outdoor-related based on keywords
export const isOutdoorTask = (title = '') => {
    const outdoorKeywords = [
      'walk',
      'run',
      'jog',
      'bike',
      'garden',
      'park',
      'outdoor',
      'outside',
      'yard',
      'lawn',
      'exercise',
      'hike',
      'play'
    ];
  
    const lowercaseTitle = title.toLowerCase();
    return outdoorKeywords.some(keyword => lowercaseTitle.includes(keyword));
  };
  
  // Function to format date
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Function to get priority color
  export const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#f44336'; // red
      case 'medium':
        return '#ff9800'; // orange
      case 'low':
        return '#4caf50'; // green
      default:
        return '#757575'; // grey
    }
  };
  
  // Function to validate task data
  export const validateTask = (task) => {
    if (!task.title || task.title.trim() === '') {
      return 'Task title is required';
    }
    if (task.title.length > 100) {
      return 'Task title must be less than 100 characters';
    }
    return null;
  };
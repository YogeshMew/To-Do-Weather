import { createSlice } from '@reduxjs/toolkit';

const loadTasksFromStorage = () => {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    return tasks || {};
  } catch (error) {
    console.error('Error loading tasks:', error);
    return {};
  }
};

const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

const initialState = {
  tasks: loadTasksFromStorage(),
  filter: 'all',
  loading: false,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initializeUserTasks: (state, action) => {
      const userId = action.payload;
      if (!state.tasks) {
        state.tasks = {};
      }
      if (!state.tasks[userId]) {
        state.tasks[userId] = [];
        saveTasksToStorage(state.tasks);
      }
    },
    addTask: (state, action) => {
      const { userId, task } = action.payload;
      if (!state.tasks) {
        state.tasks = {};
      }
      if (!state.tasks[userId]) {
        state.tasks[userId] = [];
      }
      const newTask = {
        ...task,
        id: Date.now().toString(),
        completed: false
      };
      state.tasks[userId].push(newTask);
      saveTasksToStorage(state.tasks);
    },
    toggleTask: (state, action) => {
      const { userId, taskId } = action.payload;
      if (state.tasks?.[userId]) {
        const taskIndex = state.tasks[userId].findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[userId][taskIndex].completed = !state.tasks[userId][taskIndex].completed;
          saveTasksToStorage(state.tasks);
        }
      }
    },
    deleteTask: (state, action) => {
      const { userId, taskId } = action.payload;
      if (state.tasks?.[userId]) {
        const taskIndex = state.tasks[userId].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[userId].splice(taskIndex, 1);
          saveTasksToStorage(state.tasks);
        }
      }
    },
    updateTaskPriority: (state, action) => {
      const { userId, taskId, priority } = action.payload;
      if (state.tasks?.[userId]) {
        const taskIndex = state.tasks[userId].findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[userId][taskIndex].priority = priority;
          saveTasksToStorage(state.tasks);
        }
      }
    },
    clearTasks: (state, action) => {
      const userId = action.payload;
      if (state.tasks?.[userId]) {
        state.tasks[userId] = [];
        saveTasksToStorage(state.tasks);
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  }
});

export const {
  initializeUserTasks,
  addTask,
  toggleTask,
  deleteTask,
  updateTaskPriority,
  clearTasks,
  setFilter
} = taskSlice.actions;

// Selectors
export const selectUserTasks = (state, userId) => {
  if (!userId) return [];
  return state?.tasks?.tasks?.[userId] || [];
};

export const selectFilteredTasks = state => {
  const currentUser = state?.auth?.user;
  if (!currentUser?.email) return [];
  
  const tasks = selectUserTasks(state, currentUser.email);
  const filter = state?.tasks?.filter || 'all';

  switch (filter) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'active':
      return tasks.filter(task => !task.completed);
    default:
      return tasks;
  }
};

export default taskSlice.reducer;
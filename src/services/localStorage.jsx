const TASKS_KEY = 'todo_tasks';
const AUTH_KEY = 'todo_auth';
const STORAGE_KEY = 'todo_app_state';

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const getTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
    return [];
  }
};

export const saveAuthToStorage = (authState) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Error saving auth state to localStorage:', error);
  }
};

export const getAuthFromStorage = () => {
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
    return { isAuthenticated: false, user: null };
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

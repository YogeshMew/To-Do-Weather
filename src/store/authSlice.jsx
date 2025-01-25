import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initialize users array in localStorage if it doesn't exist
const initializeUsers = () => {
  try {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify([]));
      return [];
    }
    return JSON.parse(storedUsers);
  } catch (error) {
    console.error('Error initializing users:', error);
    return [];
  }
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const currentUsers = getState().auth.users || [];
      const existingUser = currentUsers.find(user => user.email === userData.email);
      
      if (existingUser) {
        return rejectWithValue('Email already registered');
      }

      const newUser = {
        email: userData.email,
        password: userData.password
      };

      // Update localStorage
      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue('Registration failed');
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (credentials, { getState, dispatch, rejectWithValue }) => {
    try {
      const currentUsers = getState().auth.users || [];
      const user = currentUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password');
      }

      // Initialize tasks for the user
      dispatch({ 
        type: 'tasks/initializeUserTasks',
        payload: credentials.email 
      });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue('Login failed');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  users: initializeUsers() // Initialize users array
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      // Clear localStorage tasks for security
      localStorage.removeItem('tasks');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (!Array.isArray(state.users)) {
          state.users = [];
        }
        state.users = [...state.users, action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
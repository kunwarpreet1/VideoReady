import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const USER_STORAGE_KEY = '@user_data';

// Async thunk to load user from AsyncStorage
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }
);

// Async thunk to save user to AsyncStorage
export const saveUserToStorage = createAsyncThunk(
  'user/saveToStorage',
  async (userData) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw error;
    }
  }
);

// Async thunk to clear user from AsyncStorage
export const clearUserFromStorage = createAsyncThunk(
  'user/clearFromStorage',
  async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }
);

const initialState = {
  currentUser: null,
  users: [], // Array to store all users
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set current user
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // Add user to users array
    addUser: (state, action) => {
      const newUser = action.payload;
      // Check if user already exists
      const existingUserIndex = state.users.findIndex(user => user.uid === newUser.uid);
      if (existingUserIndex !== -1) {
        // Update existing user
        state.users[existingUserIndex] = { ...state.users[existingUserIndex], ...newUser };
      } else {
        // Add new user
        state.users.push(newUser);
      }
    },

    // Update user in users array
    updateUser: (state, action) => {
      const { uid, updates } = action.payload;
      const userIndex = state.users.findIndex(user => user.uid === uid);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
      // Also update current user if it's the same user
      if (state.currentUser && state.currentUser.uid === uid) {
        state.currentUser = { ...state.currentUser, ...updates };
      }
    },

    // Update profile image
    updateProfileImage: (state, action) => {
      const { uid, profileImage } = action.payload;
      
      // Update in users array
      const userIndex = state.users.findIndex(user => user.uid === uid);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], profileImage };
      }
      
      // Update current user if it's the same user
      if (state.currentUser && state.currentUser.uid === uid) {
        state.currentUser = { ...state.currentUser, profileImage };
      }
    },

    // Update user genres
    updateUserGenres: (state, action) => {
      const { uid, genres } = action.payload;
      
      // Update in users array
      const userIndex = state.users.findIndex(user => user.uid === uid);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], genres };
      }
      
      // Update current user if it's the same user
      if (state.currentUser && state.currentUser.uid === uid) {
        state.currentUser = { ...state.currentUser, genres };
      }
    },

    // Remove user from users array
    removeUser: (state, action) => {
      const uid = action.payload;
      state.users = state.users.filter(user => user.uid !== uid);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Logout user
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.currentUser = action.payload;
          state.isAuthenticated = true;
          // Add to users array if not already present
          const existingUser = state.users.find(user => user.uid === action.payload.uid);
          if (!existingUser) {
            state.users.push(action.payload);
          }
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Save user to storage
      .addCase(saveUserToStorage.fulfilled, (state, action) => {
        // User is already saved in state, just confirm storage success
      })
      .addCase(saveUserToStorage.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Clear user from storage
      .addCase(clearUserFromStorage.fulfilled, (state) => {
        // Storage cleared, user state is handled by logout reducer
      });
  },
});

export const {
  setCurrentUser,
  addUser,
  updateUser,
  updateProfileImage,
  updateUserGenres,
  removeUser,
  setLoading,
  setError,
  clearError,
  logout,
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUsers = (state) => state.user.users;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;
export const selectUserById = (state, uid) => 
  state.user.users.find(user => user.uid === uid);
export const selectCurrentUserProfileImage = (state) => 
  state.user.currentUser?.profileImage;
export const selectCurrentUserGenres = (state) => 
  state.user.currentUser?.genres || [];

export default userSlice.reducer; 
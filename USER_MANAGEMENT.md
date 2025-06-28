# User Management System

This document explains how the user management system works in the VideoReady app using Redux and AsyncStorage.

## Overview

The user management system provides:
- User authentication state management with Redux
- Persistent user data storage with AsyncStorage
- Automatic user session restoration on app restart
- Centralized user data management

## Architecture

### Redux Store Structure

```javascript
{
  user: {
    currentUser: null,        // Currently logged in user
    users: [],               // Array of all users
    isLoading: false,        // Loading state
    isAuthenticated: false,  // Authentication state
    error: null             // Error state
  }
}
```

### Key Components

1. **User Slice** (`src/redux/slice/userSlice.js`)
   - Manages user state in Redux
   - Handles AsyncStorage operations
   - Provides actions and selectors

2. **App Navigator** (`navigation/AppNavigator.js`)
   - Controls navigation based on authentication state
   - Loads user from AsyncStorage on app start
   - Listens to Firebase auth state changes

3. **Utility Functions** (`utils/userUtils.js`)
   - Helper functions for user operations
   - Standardized user data creation
   - Centralized auth logic

## Features

### User Authentication Flow

1. **Sign Up**: User creates account → Added to Redux store → Saved to AsyncStorage
2. **Sign In**: User logs in → Added to Redux store → Saved to AsyncStorage
3. **Phone Auth**: User authenticates with phone → Added to Redux store → Saved to AsyncStorage
4. **Logout**: User signs out → Cleared from Redux store → Cleared from AsyncStorage

### Session Persistence

- User data is automatically saved to AsyncStorage on login/signup
- User data is automatically loaded from AsyncStorage on app start
- If user data exists in AsyncStorage, user is automatically logged in
- If no user data exists, user sees authentication screens

### Navigation Flow

- **App Start**: Shows Splash screen while loading user data
- **Authenticated**: Shows Home screen and related screens
- **Not Authenticated**: Shows authentication screens (Splash, SignIn, etc.)

## Usage

### In Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../src/redux/slice/userSlice';
import { handleUserAuth, handleUserLogout } from '../utils/userUtils';

// Get user data
const currentUser = useSelector(selectCurrentUser);
const isAuthenticated = useSelector(selectIsAuthenticated);

// Handle login
const dispatch = useDispatch();
await handleUserAuth(dispatch, firebaseUser);

// Handle logout
await handleUserLogout(dispatch);
```

### Available Selectors

- `selectCurrentUser`: Get current logged-in user
- `selectUsers`: Get all users array
- `selectIsAuthenticated`: Check if user is authenticated
- `selectIsLoading`: Check if user data is loading
- `selectError`: Get any user-related errors
- `selectUserById`: Get specific user by UID

### Available Actions

- `setCurrentUser`: Set current user
- `addUser`: Add user to users array
- `updateUser`: Update user data
- `removeUser`: Remove user from array
- `logout`: Clear current user and auth state
- `loadUserFromStorage`: Load user from AsyncStorage
- `saveUserToStorage`: Save user to AsyncStorage
- `clearUserFromStorage`: Clear user from AsyncStorage

## User Data Structure

```javascript
{
  uid: string,              // Firebase user ID
  email: string,            // User email
  displayName: string,      // User display name
  photoURL: string,         // User profile photo
  emailVerified: boolean,   // Email verification status
  phoneNumber: string,      // Phone number (for phone auth)
  createdAt: string,        // Account creation time
  lastSignInTime: string    // Last sign in time
}
```

## Error Handling

- All AsyncStorage operations are wrapped in try-catch blocks
- Firebase auth errors are handled in individual screens
- Redux state includes error handling for failed operations
- User-friendly error messages are displayed to users

## Best Practices

1. Always use utility functions for user operations
2. Check authentication state before accessing protected screens
3. Handle loading states appropriately
4. Provide user feedback for all auth operations
5. Keep user data structure consistent across the app 
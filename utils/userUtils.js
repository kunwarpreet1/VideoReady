import { useDispatch } from 'react-redux';
import { addUser, setCurrentUser, saveUserToStorage, logout, clearUserFromStorage, updateProfileImage, updateUserGenres } from '../src/redux/slice/userSlice';
import auth from '@react-native-firebase/auth';

// Helper function to create user data object from Firebase user
export const createUserData = (firebaseUser) => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    phoneNumber: firebaseUser.phoneNumber,
    createdAt: firebaseUser.metadata.creationTime,
    lastSignInTime: firebaseUser.metadata.lastSignInTime,
  };
};

// Helper function to handle user login/signup
export const handleUserAuth = async (dispatch, firebaseUser) => {
  const userData = createUserData(firebaseUser);
  
  // Add user to Redux store
  dispatch(addUser(userData));
  dispatch(setCurrentUser(userData));
  
  // Save user to AsyncStorage
  await dispatch(saveUserToStorage(userData));
  
  return userData;
};

// Helper function to handle user logout
export const handleUserLogout = async (dispatch) => {
  try {
    // Sign out from Firebase
    await auth().signOut();
    
    // Clear user from Redux store
    dispatch(logout());
    
    // Clear user from AsyncStorage
    await dispatch(clearUserFromStorage());
    
    console.log('User logged out successfully');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// Helper function to update profile image
export const handleProfileImageUpdate = async (dispatch, uid, profileImage) => {
  try {
    // Update profile image in Redux store
    dispatch(updateProfileImage({ uid, profileImage }));
    
    // Get current user data and save to AsyncStorage
    const currentUser = auth().currentUser;
    if (currentUser) {
      const userData = createUserData(currentUser);
      userData.profileImage = profileImage;
      await dispatch(saveUserToStorage(userData));
    }
    
    console.log('Profile image updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating profile image:', error);
    return false;
  }
};

// Helper function to update user genres
export const handleUserGenresUpdate = async (dispatch, uid, genres) => {
  try {
    // Update genres in Redux store
    dispatch(updateUserGenres({ uid, genres }));
    
    // Get current user data and save to AsyncStorage
    const currentUser = auth().currentUser;
    if (currentUser) {
      const userData = createUserData(currentUser);
      userData.genres = genres;
      await dispatch(saveUserToStorage(userData));
    }
    
    console.log('User genres updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user genres:', error);
    return false;
  }
};

// Custom hook for user management
export const useUserManagement = () => {
  const dispatch = useDispatch();
  
  const loginUser = async (firebaseUser) => {
    return await handleUserAuth(dispatch, firebaseUser);
  };
  
  const logoutUser = async () => {
    return await handleUserLogout(dispatch);
  };
  
  const updateProfileImage = async (uid, profileImage) => {
    return await handleProfileImageUpdate(dispatch, uid, profileImage);
  };
  
  const updateUserGenres = async (uid, genres) => {
    return await handleUserGenresUpdate(dispatch, uid, genres);
  };
  
  return {
    loginUser,
    logoutUser,
    updateProfileImage,
    updateUserGenres,
  };
}; 
import auth from '@react-native-firebase/auth';

// Simple Firebase operations without network check
export const firebaseSimple = {
  // Create user
  createUserWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error('Firebase create user error:', error);
      throw error;
    }
  },

  // Sign in
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error('Firebase sign in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await auth().signOut();
      return true;
    } catch (error) {
      console.error('Firebase sign out error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile(updates);
        return true;
      }
      throw new Error('No user logged in');
    } catch (error) {
      console.error('Firebase update profile error:', error);
      throw error;
    }
  },
}; 
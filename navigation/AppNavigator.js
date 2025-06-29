import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import store from '../src/redux/store/store';
import { 
  setCurrentUser, 
  addUser, 
  logout, 
  loadUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsLoading
} from '../src/redux/slice/userSlice';
import SignInHeader from '../components/SignInHeader';
import LoadingScreen from '../components/LoadingScreen';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import Genre from '../screens/Genre';
import PhoneAuthScreen from '../screens/PhoneAuthScren';
import parentsignInout from '../screens/parentsignInout';
import camera from '../screens/camera';
import Location from '../screens/Location';
import HomeDrawer from '../screens/HomeDrawer';
import EditProfile from '../screens/EditProfile';
import VideoPlayer from '../screens/VideoPlayer';
import DownloadedVideos from '../screens/DownloadedVideos';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(loadUserFromStorage());
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          createdAt: firebaseUser.metadata.creationTime,
          lastSignInTime: firebaseUser.metadata.lastSignInTime,
          profileImage: firebaseUser.photoURL,
        };

        // Add user to Redux store
        dispatch(addUser(userData));
        dispatch(setCurrentUser(userData));
        
        // Save user to AsyncStorage
        await dispatch(saveUserToStorage(userData));
      } else {
        // User is signed out
        dispatch(logout());
        await dispatch(clearUserFromStorage());
      }
    });

    return subscriber;
  }, [dispatch]);

  // Show loading screen while initializing
  if (initializing || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && currentUser ? (
          <>
            <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
            <Stack.Screen name="Genre" component={Genre} />
            <Stack.Screen name="camera" component={camera} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="DownloadedVideos" component={DownloadedVideos} />
            <Stack.Screen 
              name="VideoPlayer" 
              component={VideoPlayer} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Genre" component={Genre} />
            <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <Stack.Screen name="ParentSignInOut" component={parentsignInout}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default AppNavigator;

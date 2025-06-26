import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import SignInHeader from '../components/SignInHeader';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import HomeScreen from '../screens/Home'
import PhoneAuthScreen from '../screens/PhoneAuthScren';
import parentsignInout from '../screens/parentsignInout';
import camera from '../screens/camera';
import Location from '../screens/Location';
import HomeDrawer from '../screens/HomeDrawer';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>


            <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
            <Stack.Screen name="camera" component={camera} />
            <Stack.Screen name="Location" component={Location} />
            {/* <Stack.Screen name="HomeDrawer" component={HomeDrawer} /> */}

          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            {/* <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:true}} />
            <Stack.Screen name="SignUp" component={SignUp} /> */}
            <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <Stack.Screen
              name="ParentSignInOut"
              component={parentsignInout}
              options={{
                headerShown: true,
                header: () => <SignInHeader />
              }}
            />

            <Stack.Screen name="Onboarding" component={Onboarding} />


          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

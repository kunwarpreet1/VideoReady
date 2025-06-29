import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import Home from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearUserFromStorage, selectCurrentUser, selectCurrentUserProfileImage } from '../src/redux/slice/userSlice';
import { handleUserLogout } from '../utils/userUtils';

const Drawer = createDrawerNavigator();

// 🎯 Main screen component
function MainScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenText}>Welcome to HomeDrawer</Text>
    </View>
  );
}

// 🎨 Custom drawer content
function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const profileImage = useSelector(selectCurrentUserProfileImage);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take pictures.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS handled via Info.plist
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const success = await handleUserLogout(dispatch);
            if (!success) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
                // Navigation will automatically handle the redirect to sign-in
          },
        },
      ]
    );
  };

  const handleMenuItemPress = (item) => {
    if (item === 'Sign Out') {
      handleSignOut();
    } else if (item === 'My Profiles') {
      props.navigation.navigate('EditProfile');
    } else if (item === 'Downloaded Videos') {
      props.navigation.navigate('DownloadedVideos');
    } else {
      // Handle other menu items here
      console.log('Menu item pressed:', item);
    }
  };

  const drawerItems = [
    'My account',
    'Settings',
    'My Profiles',
    'My Devices',
    'Giftcode / Voucher',
    'My Transaction',
    'My Playlist',
    'Watch History',
    'Downloaded Videos',
    'Smart TV Quick Login',
    'Sign Out',
  ];

  // Get display name from current user or use default
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.profileSection}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/images/homeassets/avtar.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{displayName}</Text>
      </View>

      <View style={styles.menuItems}>
        {drawerItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleMenuItemPress(item)} 
            style={[
              styles.menuItem,
              item === 'Sign Out' && styles.signOutItem
            ]}
          >
            <Text style={[
              styles.menuText,
              item === 'Sign Out' && styles.signOutText
            ]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

// ✅ Main Drawer Wrapper
export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* <Drawer.Screen name="Main" component={MainScreen} /> */}
      <Drawer.Screen name="Home" component={Home} options={{headerShown:false}}/>
    </Drawer.Navigator>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#001122',
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    color: '#fff',
    fontSize: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#334',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  editProfile: {
    color: '#4ac4fa',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 6,
  },
  menuItems: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    marginVertical: 10,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  signOutItem: {
    // backgroundColor: '#ff6b6b20',
    // borderWidth: 1,
    // borderColor: '#ff6b6b',
  },
  signOutText: {
    fontWeight: 'bold',
    // color: '#ff6b6b',
  },
});

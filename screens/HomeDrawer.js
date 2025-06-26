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
import Home from './Home';

const Drawer = createDrawerNavigator();

// 📄 Main screen content
function MainScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenText}>Welcome to HomeDrawer</Text>
    </View>
  );
}

// 🎨 Custom drawer content
function CustomDrawerContent(props) {
  const [profileImage, setProfileImage] = useState(null);

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

  const openEditOptions = async () => {
    Alert.alert('Edit Profile Picture', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const hasPermission = await requestCameraPermission();
          if (hasPermission) {
            launchCamera({ mediaType: 'photo' }, (res) => {
              if (!res.didCancel && !res.errorCode && res.assets?.[0]) {
                setProfileImage(res.assets[0].uri);
              }
            });
          } else {
            Alert.alert('Permission Denied', 'Camera permission is required.');
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, (res) => {
            if (!res.didCancel && !res.errorCode && res.assets?.[0]) {
              setProfileImage(res.assets[0].uri);
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
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
        <Text style={styles.name}>Tony</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity onPress={openEditOptions}>
          <Text style={styles.editProfile}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Reset Picture Button */}
        <TouchableOpacity onPress={() => setProfileImage(null)}>
          <Text style={[styles.editProfile, { color: '#ff6b6b' }]}>Reset Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuItems}>
        {drawerItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => {}} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
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
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});

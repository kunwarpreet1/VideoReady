import {
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to provide better services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        showSettingsPopup();
        return false;
      } else {
        return false;
      }
    } else {
      // iOS
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        showSettingsPopup();
        return false;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const checkLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return result === RESULTS.GRANTED;
    } else {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

export const showSettingsPopup = () => {
  Alert.alert(
    'Location Permission Required',
    'This app needs location access to provide better services. Please enable location permission in settings.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            openSettings();
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
    { cancelable: false }
  );
};

export const handleLocationPermission = async () => {
  const hasPermission = await checkLocationPermission();
  
  if (hasPermission) {
    return true;
  }
  
  const granted = await requestLocationPermission();
  return granted;
}; 
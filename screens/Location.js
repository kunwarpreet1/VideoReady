import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

const Location = () => {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        console.log(error);
        if (error.code === 1) {
          Alert.alert('Permission denied', 'Location permission is required.');
        } else if (error.code === 2) {
          Alert.alert(
            'Location services disabled',
            'Please enable location/GPS services.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert('Error getting location', error.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Current Location</Text>
      {location ? (
        <>
          <Text style={styles.coord}>Latitude: {location.latitude}</Text>
          <Text style={styles.coord}>Longitude: {location.longitude}</Text>
        </>
      ) : (
        <Text style={styles.coord}>Fetching location...</Text>
      )}
      <Button title="Refresh Location" onPress={getLocation} />
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  coord: {
    color: '#ddd',
    marginBottom: 10,
    fontSize: 16,
  },
});

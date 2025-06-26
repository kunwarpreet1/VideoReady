import { View, Button, Image, Alert, Platform, StyleSheet } from "react-native";
import { launchCamera } from "react-native-image-picker";
import { PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { useState } from "react";

async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "This app needs access to your camera.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);

    if (result === RESULTS.GRANTED) {
      return true;
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Camera Permission',
        'Camera permission is blocked. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert('Camera permission denied. Please allow it to use the camera.');
    } else if (result === RESULTS.UNAVAILABLE) {
      Alert.alert('Camera is not available on this device (simulator).');
    }

    return false;
  }
}

function Camera() {
    
  const [pickedImage, setPickedImage] = useState();

  async function takeImageHandler() {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    console.log(result);

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setPickedImage(imageUri);
      console.log('Image URI:', imageUri);
    } else {
      console.log('Camera cancelled or error');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        {pickedImage ? (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        ) : (
          <Button title="No image picked yet" disabled />
        )}
      </View>
      <Button title='Take Image' onPress={takeImageHandler} />
    </View>
  );
}

export default Camera;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 300,
    height: 200,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

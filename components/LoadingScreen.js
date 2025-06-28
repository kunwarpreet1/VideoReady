import React from 'react';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VRLogo from '../assets/images/logo.svg'; // SVG logo

const LoadingScreen = () => {
  return (
    <LinearGradient
      colors={['#000A1F', '#001D3D']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000A1F" />
      <VRLogo width={170} height={170} style={styles.logo} />
    </LinearGradient>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
  },
}); 
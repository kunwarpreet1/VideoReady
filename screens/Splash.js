import React, { useEffect } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import VRLogo from '../assets/images/logo.svg'; // SVG logo

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 6000); // 6-second splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#000A1F', '#001D3D']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000A1F" />
      <VRLogo width={170} height={170} style={styles.logo} />
      {/* <ActivityIndicator size="large" color="#4FC3F7" style={styles.loader} /> */}
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});

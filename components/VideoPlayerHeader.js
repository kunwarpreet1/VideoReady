import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const VideoPlayerHeader = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#001122',
    height: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default VideoPlayerHeader; 
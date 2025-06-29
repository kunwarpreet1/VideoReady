import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import VRLogo from '../assets/images/signInlogo.svg'

const SignInHeader = () => {
  return (
    <View style={styles.header}>
      <VRLogo width={200} height={30} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#001122',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});

export default SignInHeader;
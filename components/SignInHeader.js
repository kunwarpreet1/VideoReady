import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SignInHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>VideoReady</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#001122',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});

export default SignInHeader;
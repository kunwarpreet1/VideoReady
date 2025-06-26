import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <IconLabel icon="home" label="Home" />
      <IconLabel icon="film" label="Movie" />
      <IconLabel icon="smile-o" label="Kids" />
      <IconLabel icon="tv" label="Live TV" />
      <IconLabel icon="bars" label="Menu" />
    </View>
  );
}

function IconLabel({ icon, label }) {
  return (
    <View style={styles.iconContainer}>
      <FontAwesome name={icon} size={24} color="white" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 12,
  },
});

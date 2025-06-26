import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Banner() {
  return (
    <ImageBackground
      source={require('../../assets/images/homeassets/morbius.jpg')}
      style={styles.banner}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Morbius</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="info-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}> More details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.watchNow]}>
            <FontAwesome name="play" size={18} color="#fff" />
            <Text style={styles.buttonText}> Watch Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="plus" size={18} color="#fff" />
            <Text style={styles.buttonText}> Add to playlist</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.genre}>Action | Thriller | Suspense</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 300,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  watchNow: {
    backgroundColor: '#1e90ff',
    borderRadius: 6,
    padding: 4,
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
  },
  genre: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

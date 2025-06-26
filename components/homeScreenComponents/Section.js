import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function Section({ title, items }) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.more}>More</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <Image key={index} source={item.image} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  more: {
    color: '#1e90ff',
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 10,
  },
});

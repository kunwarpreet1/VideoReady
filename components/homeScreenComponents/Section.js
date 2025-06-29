import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Section({ title, items, navigation }) {
  const getVideoData = (imageName) => {
    const videoData = {
      'squidgame.png': {
        title: 'John Wick',
        description: 'An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.',
        genre: 'Action | Crime | Thriller'
      },
      'kabirsingh.png': {
        title: 'Kabir Singh',
        description: 'A brilliant yet alcoholic surgeon goes down a self-destructive path after the love of his life is forced to marry another man.',
        genre: 'Drama | Romance'
      },
      'ballerina.jpeg': {
        title: 'Morbius',
        description: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
        genre: 'Action | Thriller | Suspense'
      },
      'panchayat.png': {
        title: 'Kabir Singh',
        description: 'A comedy-drama series that follows the life of Abhishek, a fresh engineering graduate who joins as a Panchayat secretary in a remote village.',
        genre: 'Comedy | Drama'
      },
      'johnwick.png': {
        title: 'John Wick',
        description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
        genre: 'Action | Crime | Thriller'
      },
      'moneyheist.png': {
        title: 'Morbius',
        description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
        genre: 'Action | Crime | Drama'
      },
      'morbius.jpg': {
        title: 'Morbius',
        description: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
        genre: 'Action | Horror | Sci-Fi'
      }
    };
    
    return videoData[imageName] || {
      title: 'Morbius',
      description: 'A sample video for demonstration purposes.',
      genre: 'Action | Adventure'
    };
  };

  const handleImagePress = (item) => {
    const imageName = item.image.toString().split('/').pop();
    const videoData = getVideoData(imageName);
    
    navigation.navigate('VideoPlayer', {
      videoTitle: videoData.title
    });
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.more}>More</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleImagePress(item)}
            activeOpacity={0.8}
          >
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
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

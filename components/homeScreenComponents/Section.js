import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Section({ title, items, navigation }) {
  const getVideoData = (imageName) => {
    const videoData = {
      'squidgame.png': {
        title: 'Squid Game',
        url: require('../../assets/Videos/John Wick.mp4'),
        description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
        genre: 'Thriller | Drama | Action'
      },
      'kabirsingh.png': {
        title: 'Kabir Singh',
        url: require('../../assets/Videos/Kabir Singh.mp4'),
        description: 'A brilliant yet alcoholic surgeon goes down a self-destructive path after the love of his life is forced to marry another man.',
        genre: 'Drama | Romance'
      },
      'ballerina.jpeg': {
        title: 'Ballerina',
        url: require('../../assets/Videos/Morbius.mp4'),
        description: 'A young ballerina seeks revenge against those who killed her family, using her exceptional skills as a dancer and assassin.',
        genre: 'Action | Thriller | Drama'
      },
      'panchayat.png': {
        title: 'Panchayat',
        url: require('../../assets/Videos/Kabir Singh.mp4'),
        description: 'A comedy-drama series that follows the life of Abhishek, a fresh engineering graduate who joins as a Panchayat secretary in a remote village.',
        genre: 'Comedy | Drama'
      },
      'johnwick.png': {
        title: 'John Wick',
        url: require('../../assets/Videos/John Wick.mp4'),
        description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
        genre: 'Action | Crime | Thriller'
      },
      'moneyheist.png': {
        title: 'Money Heist',
        url: require('../../assets/Videos/Morbius.mp4'),
        description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
        genre: 'Action | Crime | Drama'
      },
      'morbius.jpg': {
        title: 'Morbius',
        url: require('../../assets/Videos/Morbius.mp4'),
        description: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
        genre: 'Action | Horror | Sci-Fi'
      }
    };
    
    return videoData[imageName] || {
      title: 'Sample Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'A sample video for demonstration purposes.',
      genre: 'Action | Adventure'
    };
  };

  const handleImagePress = (item) => {
    const imageName = item.image.toString().split('/').pop();
    const videoData = getVideoData(imageName);
    
    navigation.navigate('VideoPlayer', {
      videoTitle: videoData.title,
      videoUrl: videoData.url,
      videoDescription: videoData.description,
      videoGenre: videoData.genre
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

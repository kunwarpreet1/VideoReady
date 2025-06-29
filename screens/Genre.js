import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

const genresData = [
  { id: '1', name: 'Action', image: require('../assets/images/Genre/action.png') },
  { id: '2', name: 'Romance', image: require('../assets/images/Genre/romance.png') },
  { id: '3', name: 'Comedy', image: require('../assets/images/Genre/comedy.png') },
  { id: '4', name: 'War', image: require('../assets/images/Genre/war.png') },
  { id: '5', name: 'Horror', image: require('../assets/images/Genre/horror.png') },
  { id: '6', name: 'Sci-Fi', image: require('../assets/images/Genre/sciencefi.png') },
  { id: '7', name: 'Cartoon', image: require('../assets/images/Genre/cartoon.png') },
  { id: '8', name: 'Drama', image: require('../assets/images/Genre/Drama.png') },
  { id: '9', name: 'Documentary', image: require('../assets/images/Genre/doc.png') },
  { id: '10', name: 'Mystery', image: require('../assets/images/Genre/mystery.png') },
  { id: '11', name: 'Sports', image: require('../assets/images/Genre/sports.png') },
  { id: '12', name: 'Rom-Com', image: require('../assets/images/Genre/war.png') },
];

export default function Genre({ navigation }) {
  const [selected, setSelected] = useState([]);

  // Toggle genre selection
  const toggleGenre = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Handle continue button
  const handleContinue = () => {
    if (selected.length < 3) {
      Alert.alert('Please select at least 3 genres');
      return;
    }

    const selectedGenres = selected.map(id => {
      const genre = genresData.find(g => g.id === id);
      return genre ? genre.name : '';
    }).filter(name => name !== '');

    Alert.alert(
      'Genres Selected!', 
      `You selected: ${selectedGenres.join(', ')}`,
      [
        {
          text: 'Continue',
          onPress: () => navigation.replace('HomeDrawer')
        }
      ]
    );
  };

  // Handle skip button
  const handleSkip = () => {
    Alert.alert(
      'Skip Genre Selection',
      'You can set preferences later in your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => navigation.replace('HomeDrawer') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Genres</Text>
      <Text style={styles.subtitle}>Select at least 3 favorite genres</Text>

      <ScrollView style={styles.genreContainer}>
        <View style={styles.genreGrid}>
          {genresData.map((genre) => {
            const isSelected = selected.includes(genre.id);
            return (
              <TouchableOpacity
                key={genre.id}
                style={[styles.genreCard, isSelected && styles.selectedCard]}
                onPress={() => toggleGenre(genre.id)}
              >
                <Image source={genre.image} style={styles.genreImage} />
                <Text style={styles.genreName}>{genre.name}</Text>
                {isSelected && <View style={styles.checkmark} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, selected.length < 3 && styles.disabledButton]}
          disabled={selected.length < 3}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            {selected.length < 3 ? `Select ${3 - selected.length} more` : 'Continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001122',
    paddingTop: 50,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  genreContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreCard: {
    width: '30%',
    backgroundColor: '#112233',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#4ac4fa',
  },
  genreImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  genreName: {
    color: '#fff',
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    backgroundColor: '#4ac4fa',
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipText: {
    color: '#4ac4fa',
    textAlign: 'center',
    fontSize: 16,
  },
});
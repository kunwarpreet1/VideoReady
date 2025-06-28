import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserGenres, selectCurrentUser, selectCurrentUserGenres } from '../src/redux/slice/userSlice';
import { handleUserGenresUpdate } from '../utils/userUtils';

const genresData = [
  { id: '1', name: 'Action', image: require('../assets/images/Genre/action.png') },
  { id: '2', name: 'Romance', image: require('../assets/images/Genre/romance.png') },
  { id: '3', name: 'Comedy', image: require('../assets/images/Genre/comedy.png') },
  { id: '4', name: 'War', image: require('../assets/images/Genre/war.png') },
  { id: '5', name: 'Horror', image: require('../assets/images/Genre/horror.png') },
  { id: '6', name: 'Sci- Fi', image: require('../assets/images/Genre/sciencefi.png') },
  { id: '7', name: 'Cartoon', image: require('../assets/images/Genre/cartoon.png') },
  { id: '8', name: 'Drama', image: require('../assets/images/Genre/Drama.png') },
  { id: '9', name: 'Documentary', image: require('../assets/images/Genre/doc.png') },
  { id: '10', name: 'Mystery', image: require('../assets/images/Genre/mystery.png') },
  { id: '11', name: 'Sports', image: require('../assets/images/Genre/sports.png') },
  { id: '12', name: 'Rom-Com', image: require('../assets/images/Genre/war.png') },
];

export default function Genre({ navigation, route }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const existingGenres = useSelector(selectCurrentUserGenres);
  const [selected, setSelected] = useState([]);

  // Check if this is editing mode (coming from profile) or new user mode
  const isEditing = route.params?.isEditing || false;

  // Initialize selected genres from existing user preferences
  useEffect(() => {
    if (existingGenres && existingGenres.length > 0) {
      const selectedIds = existingGenres.map(genreName => {
        const genre = genresData.find(g => g.name === genreName);
        return genre ? genre.id : null;
      }).filter(id => id !== null);
      setSelected(selectedIds);
    }
  }, [existingGenres]);

  const toggleSelection = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const renderGenre = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        style={[styles.genreCard, isSelected && styles.selectedCard]}
      >
        <Image source={item.image} style={styles.image} />
        <Text style={styles.label}>{item.name}</Text>
        {isSelected && <View style={styles.checkmark} />}
      </TouchableOpacity>
    );
  };

  const handleConfirm = async () => {
    if (selected.length < 3) {
      Alert.alert('Select at least 3 genres');
      return;
    }

    try {
      // Get selected genre names
      const selectedGenres = selected.map(id => {
        const genre = genresData.find(g => g.id === id);
        return genre ? genre.name : '';
      }).filter(name => name !== '');

      // Save genres to Redux and AsyncStorage
      if (currentUser?.uid) {
        await handleUserGenresUpdate(dispatch, currentUser.uid, selectedGenres);
        
        if (isEditing) {
          Alert.alert('Success', 'Your genre preferences have been updated!');
          navigation.goBack();
        } else {
          Alert.alert('Success', 'Your genre preferences have been saved!');
          navigation.replace('HomeDrawer');
        }
      } else {
        Alert.alert('Error', 'User not found. Please try again.');
      }
    } catch (error) {
      console.error('Error saving genres:', error);
      Alert.alert('Error', 'Failed to save genre preferences. Please try again.');
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      navigation.goBack();
    } else {
      Alert.alert(
        'Skip Genre Selection',
        'You can always set your preferences later in your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Skip', 
            onPress: () => navigation.replace('HomeDrawer')
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {isEditing ? 'Edit Your Genres' : 'Choose Your Genres'}
      </Text>
      <Text style={styles.subheading}>
        {isEditing 
          ? 'Update your favorite genres to personalize your experience'
          : 'Select at least 3 favorite genres to personalize your experience'
        }
      </Text>

      <FlatList
        data={genresData}
        renderItem={renderGenre}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.genreList}
      />

      <TouchableOpacity
        style={[styles.confirmBtn, selected.length < 3 && styles.disabledBtn]}
        disabled={selected.length < 3}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmText}>
          {selected.length < 3 
            ? `Select ${3 - selected.length} more` 
            : isEditing ? 'Update Genres' : 'Continue to App'
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skip}>
          {isEditing ? 'Cancel' : 'Skip for now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001122',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  genreList: {
    justifyContent: 'center',
  },
  genreCard: {
    width: '30%',
    margin: '1.6%',
    backgroundColor: '#112233',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#4ac4fa',
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  label: {
    color: '#fff',
    paddingVertical: 8,
    fontSize: 13,
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
  confirmBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledBtn: {
    backgroundColor: '#555',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skip: {
    textAlign: 'center',
    color: '#4ac4fa',
    fontSize: 16,
    marginTop: 15,
  },
});
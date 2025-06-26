import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeDrawer from '../../screens/HomeDrawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function Header() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      {/* Search Bar in the middle (conditionally rendered) */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          <TouchableOpacity onPress={() => setSearchVisible(false)} style={styles.closeIcon}>
            <FontAwesome name="close" size={17} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Icons (Search, Notification, Profile) */}
      <View style={styles.icons}>
        {!searchVisible && (
          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <FontAwesome name="search" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#77eb77" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#10151e',
    position: 'relative',
  },
  logo: {
    width: 30,
    height: 30,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 12,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 50,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2a38',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
  },
  closeIcon: {
    marginLeft: 8,
  },
});

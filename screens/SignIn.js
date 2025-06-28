import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { handleUserAuth } from '../utils/userUtils';
import auth from '@react-native-firebase/auth';

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInUser = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // Handle user authentication using utility function
      await handleUserAuth(dispatch, firebaseUser);
      
      Alert.alert('Success', 'Signed in successfully!');
      navigation.replace('HomeDrawer');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found with this email address!');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 40, color: 'white', fontSize: 40, textAlign: 'center' }}>Sign In</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor='white'
        style={styles.input}
        value={email}
        onChangeText={txt => setEmail(txt)}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor='white'
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={txt => setPassword(txt)}
      />
      <TouchableOpacity style={styles.button} onPress={signInUser}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#001122',
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#68b5e5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Success', 'Logged in successfully');
        // You can navigate to Home or Dashboard screen here if needed
        // navigation.navigate('Home'); 
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No user found with this email');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Incorrect password');
        } else {
          Alert.alert('Error', error.message);
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 40, color:'white',fontSize: 40, textAlign: 'center' }}>Sign in</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor='white'
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor='white'
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={[styles.button, { backgroundColor: '#2196F3' }]}
      >
        <Text style={styles.buttonText}>Go to Sign Up</Text>
      </TouchableOpacity> */}
              <TouchableOpacity onPress={() => navigation.navigate('PhoneAuth')}>
                <Text style={styles.mobile}>login with mobile/otp</Text>
              </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor:'#001122'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color:'white'
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  mobile:{
        color: '#4FC3F7',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  }
});

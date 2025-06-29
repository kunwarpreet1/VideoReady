import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const SignUp = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const createUser = async () => {
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            
            Alert.alert('Success', 'User account created successfully!');
            
            // Navigate to Genre selection screen
            navigation.replace('Genre');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'That email address is already in use!');
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
            <Text style={{ marginBottom: 40, color: 'white', fontSize: 40, textAlign: 'center' }}>Create account</Text>
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
            <TouchableOpacity style={styles.button} onPress={createUser}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUp;

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

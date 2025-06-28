import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { handleUserAuth } from '../utils/userUtils';

const PhoneAuthScreen = () => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // Step 1: Send verification code
  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      Alert.alert('Error sending code', error.message);
    }
  };

  // Step 2: Confirm code
  const confirmCode = async () => {
    try {
      const result = await confirm.confirm(code);
      const firebaseUser = result.user;
      
      // Handle user authentication using utility function
      await handleUserAuth(dispatch, firebaseUser);
      
      Alert.alert('Phone auth successful 🎉');
      // Navigation will be handled automatically by AppNavigator based on Redux state
    } catch (error) {
      Alert.alert('Invalid code 😢', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!confirm ? (
        <>
          <Text style={{ textAlign: "center", fontSize: 40, color: "white", marginBottom: 40 }}> Mobile Login</Text>
          <Text style={styles.label}>Enter Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91XXXXXXXXXX"
            placeholderTextColor="white"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Button title="Send Code" onPress={signInWithPhoneNumber} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="white"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <Button title="Confirm Code" onPress={confirmCode} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#001122' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: "white", 
    marginBottom: 20, 
    fontSize: 18, 
    color: "white" 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: "white" 
  }
});

export default PhoneAuthScreen;

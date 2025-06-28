import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignInHeader from '../components/SignInHeader'
import SignIn from './SignIn';
import SignUp from './SignUp';

const tab = createMaterialTopTabNavigator();

const parentsignInout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#001122' }}>
      <StatusBar barStyle="light-content" backgroundColor="#001122" />
      
      {/* Header */}
      <SignInHeader />
      
      {/* Tab Navigator */}
      <View style={{ flex: 1 }}>
        <tab.Navigator screenOptions={{
          tabBarStyle: { backgroundColor: '#001122' },
          tabBarLabelStyle: { color: 'white', fontWeight: "700" },
          tabBarIndicatorStyle: { backgroundColor: 'white' }
        }}>
          <tab.Screen name="SignIn" component={SignIn} />
          <tab.Screen name="SignUp" component={SignUp} />
        </tab.Navigator>
      </View>
    </SafeAreaView>
  )
}

export default parentsignInout
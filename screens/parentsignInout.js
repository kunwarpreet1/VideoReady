import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SignIn from './SignIn';
import SignUp from './SignUp';
const tab= createMaterialTopTabNavigator();
const parentsignInout = () => {
  return (
<tab.Navigator screenOptions={{
    tabBarStyle:{backgroundColor:'#001122'},
    tabBarLabelStyle:{color:'white',fontWeight:"700"}
}}>
    <tab.Screen name="SignIn" component={SignIn}/>

    <tab.Screen name="SignUp" component={SignUp}/>
</tab.Navigator>
  )
}

export default parentsignInout
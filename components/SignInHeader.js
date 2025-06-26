import { View, Text } from 'react-native'
import React from 'react'
import VRLogo from '../assets/images/vr-logo.svg'; // SVG logo
const SignInHeader = () => {
  return (

    <View style={{flex:1, backgroundColor:"#001122", justifyContent:"center",alignItems:"center"
    }}>
              
      <Text style={{fontSize:15,color:"white",fontWeight:"500",borderBottomWidth:2,borderColor:"white"}}>VideoReady</Text>
    </View>

 
    
    // <SafeAreaView style={{ height:120,flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#001122"}}>
    //            <VRLogo width={180} height={180}/>
    // </SafeAreaView>
    

    
  )
}

export default SignInHeader;
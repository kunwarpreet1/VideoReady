// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// const HomeScreen = ({ navigation }) => {
//   const logout = () => {
//     auth().signOut().then(() => {
//       navigation.replace('SignIn');
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to the Home Screen!</Text>
//           <FontAwesome name="plus" size={30} color="#cccc" />
//       <TouchableOpacity style={styles.button} onPress={logout}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   text: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#FF5252',
//     padding: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });


// home.js
import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/homeScreenComponents/Header';
import Banner from '../components/homeScreenComponents/Banner';
import Section from '../components/homeScreenComponents/Section';
import Footer from '../components/homeScreenComponents/Footer';


export default function Home({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Header />

      <ScrollView>
        <Banner navigation={navigation} />

        <Section
          title="Flash Channel"
          items={[
            { image: require('../assets/images/homeassets/squidgame.png') },
            { image: require('../assets/images/homeassets/kabirsingh.png') },
            { image: require('../assets/images/homeassets/ballerina.jpeg') },
          ]}
          navigation={navigation}
        />

        <Section
          title="Stay at Home"
          items={[
            { image: require('../assets/images/homeassets/panchayat.png') },
            { image: require('../assets/images/homeassets/johnwick.png') },
            { image: require('../assets/images/homeassets/moneyheist.png') },
            { image: require('../assets/images/homeassets/morbius.jpg') },
          ]}
          navigation={navigation}
        />
      </ScrollView>
                  
      <Footer />
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

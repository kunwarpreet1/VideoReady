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
import { View, ScrollView, StyleSheet,Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import Header from '../components/homeScreenComponents/Header';
import Banner from '../components/homeScreenComponents/Banner';
import Section from '../components/homeScreenComponents/Section';
import Footer from '../components/homeScreenComponents/Footer';


export default function Home({navigation}) {
      const logout = () => {
    auth().signOut().then(() => {
     navigation.replace('SignIn');
  });
  };

  return (


    <View style={styles.container}>
      <Header />



      <ScrollView>

        <Banner />

        <Section
          title="Flash Channel"
          items={[
            { image: require('../assets/images/homeassets/sqidgame.png') },
            { image: require('../assets/images/homeassets/kabirsingh.png') },
          ]}
        />

        <Section
          title="Stay at Home"
          items={[
            { image: require('../assets/images/homeassets/panchayat.png') },
            { image: require('../assets/images/homeassets/johnwick.png') },
            { image: require('../assets/images/homeassets/moneyheist.png') },
          ]}
        />
      </ScrollView>
                    <View>
      <Button title="logout" onPress={logout}></Button>
      </View>

      <Footer />
                          <View>
      <Button title="add photo" onPress={() =>navigation.navigate("camera")}/>
      </View>
                                <View>
      <Button title="add Location" onPress={() =>navigation.navigate("Location")}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

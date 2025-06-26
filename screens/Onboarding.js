import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import VRLogo from '../assets/images/vr-logo.svg';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'VideoReady',
    subtitle: 'Anywhere on\n5 devices, 2 concurrently',
    description: 'Watch on Mobile, Smart TV and more',
    image: require('../assets/images/onboarding/on1.png'),
  },
  {
    title: 'VideoReady',
    subtitle: 'Stream Anytime\nAnywhere',
    description: 'Access across all your devices',
    image: require('../assets/images/onboarding/on2.png'),
  },
  {
    title: 'VideoReady',
    subtitle: 'Enjoy Seamless\nEntertainment',
    description: 'One subscription. Unlimited fun.',
    image: require('../assets/images/onboarding/on3.png'),
  },
];

const Onboarding = () => {
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['#000A1F', '#020D1A']}
        style={styles.bottomContainer}
      >
        <VRLogo width={180} height={90} style={styles.logo} />
        <Text style={styles.stream}>S T R E A M</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={slides}
        width={width}
        height={height}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => renderItem({ item })}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <CustomButton
          title="GET ENTERTAINED"
          onPress={() => navigation.navigate('ParentSignInOut')}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ParentSignInOut')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000A1F',
  },
  slide: {
    width: width,
    height: height,
  },
  image: {
    width: width,
    height: height * 0.45, // Only top 55% has image
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#000A1F',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    marginBottom: 5,
  },
  stream: {
    color: '#4FC3F7',
    letterSpacing: 6,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  description: {
    color: '#AAB0BE',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 10,
  },
  inactiveDot: {
    backgroundColor: '#AAB0BE',
  },
  skip: {
    color: '#4FC3F7',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
});

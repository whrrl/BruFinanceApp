import {useEffect, useRef} from 'react';
import {Animated, Button, Image, SafeAreaView, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 20,
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default LoadingScreen = ({navigation}) => {
  useEffect(() => {
    fadeIn();
    setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              // Bind opacity to animated value
              opacity: fadeAnim,
            },
          ]}>
          <Image source={require('./../assets/BRU-LOGO.png')} />
        </Animated.View>
        {/* <Button
          title="Go to Home Page"
          onPress={() => navigation.navigate('Home')}
        /> */}
      </SafeAreaView>
    </>
  );
};

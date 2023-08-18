import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    marginBottom: 10,
    height: 50,
  },
  logoImageImg: {
    height: 38,
    width: 100,
  },
});

export default HeaderLogo = ({navigation}) => {
  return (
    <View style={styles.logoImage}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Image
          style={styles.logoImageImg}
          source={require('../../assets/brufinanceLogo.png')}
        />
      </Pressable>
    </View>
  );
};

import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    marginTop: 0,
    marginBottom: 5,
  },
  logoImageImg: {
    height: 30,
    width: 30,
  },
});

export default HeaderLogoRight = ({navigation}) => {
  return (
    <View style={styles.logoImage}>
      <Pressable onPress={() => navigation.navigate('Wallet')}>
        <Image
          style={styles.logoImageImg}
          source={require('../../assets/transaction.png')}
        />
      </Pressable>
    </View>
  );
};

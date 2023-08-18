import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    marginTop: 10,
    marginBottom: 20,
  },
  logoImageImg: {
    height: 70,
    width: 150,
  },
  welcomeText: {
    marginTop: 50,
    marginBottom: 20,
    text: {
      fontSize: 20,
      color: 'black',
    },
    heading: {
      marginTop: 5,
      flexDirection: 'row',
    },
    heading1: {
      fontSize: 40,
      color: '#540F7A',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
    },
    heading2: {
      fontSize: 40,
      color: 'black',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
    },
  },
  buttonContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 20,
    flex: 1,
  },
  appButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'transparent',
    borderColor: '#7C037B',
    borderWidth: 2,
    width: '100%',
    view: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#7C037B',
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },
  connectButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#7C037B',
    borderColor: '#7C037B',
    borderWidth: 2,
    width: '100%',
    view: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },

  descText: {
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: '400',
  },
});

export default HomeScreen = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoImage}>
          <Image
            style={styles.logoImageImg}
            source={require('./../assets/BRU-LOGO.png')}
          />
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeText.text}>👋 Welcome to </Text>
          <View style={styles.welcomeText.heading}>
            <Text style={styles.welcomeText.heading1}>Brú </Text>
            <Text style={styles.welcomeText.heading2}>Finance </Text>
          </View>
        </View>
        <View>
          <Text style={styles.descText}>
            Creating a new paradigm of DeFi 2.5, bringing emerging market asset
            backed bonds to decentralized finance.{' '}
          </Text>
        </View>
        <View style={styles.buttonContent}>
          <Pressable
            style={styles.connectButton}
            onPress={() => navigation.navigate('Wallet')}>
            <View style={styles.connectButton.view}>
              <Text style={styles.connectButton.text}>Connect</Text>
            </View>
          </Pressable>
          <Pressable style={styles.appButton}>
            <View style={styles.appButton.view}>
              <Text style={styles.appButton.text}>Continue to App</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
};

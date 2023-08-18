import {Avatar, ListItem} from '@rneui/base';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card, List} from 'react-native-paper';
import {green200} from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
  },
  headerComponent: {
    flexDirection: 'row',
    borderBottomRadius: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: '#7C037B',
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    marginRight: 15,
    box: {
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 15,
      borderBottomRadius: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#7C037B',
      marginTop: 15,
      alignSelf: 'right',
      justifyContent: 'right',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
  },
  cardMain: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  logoImageImg: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  listData: {
    marginTop: 20,
  },

  listViewForCoin: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    text: {
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      marginBottom: 10,
    },
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },

  card: {
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 280,
    height: 150,
    borderColor: '#1A9E69',
    borderWidth: 2,
    borderRadius: 8,
    text: {
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 13,
      lineHeight: 21,
      letterSpacing: 0.25,
    },
  },
  textNumber: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#7C037B',
  },
  buttonContent: {
    bottom: 0,
    left: 0,
    flex: 1,
  },
  connectButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#7C037B',
    borderColor: '#7C037B',
    borderWidth: 2,
    width: '80%',
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
});

export default CompleteTransactions = ({navigation, route}) => {
  const txType = route?.params?.txType;
  const data = JSON.parse(route?.params?.data);
  const txData = JSON.parse(route?.params?.txData);

  const viewDepositorsOnPolygonClicked = async () => {
    await Linking.openURL(
      `https://mumbai.polygonscan.com/token/${txData.hash}`,
    ).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <>
      <View style={styles.headerComponent}>
        <Pressable style={styles.headerComponent.box}>
          <Text style={styles.headerComponent.text}>Successful</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.listData}>
            <View
              style={{
                margin: 5,
              }}>
              <Image
                style={styles.logoImageImg}
                source={require('./../assets/right-img.png')}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                margin: 5,
              }}>
              <Text style={styles.listViewForCoin.text}>
                {txType} Transaction Successful
              </Text>
            </View>
          </View>
          {txType == 'BUY' ? (
            <View style={styles.card}>
              <View>
                <Text style={styles.card.text}>IndiaAgro bond of</Text>
                <Text style={styles.card.text}>USDT {data.amount}</Text>
                <Text style={styles.card.text}>has been successful</Text>
                <Text style={styles.card.text}>
                  purchased on {new Date().toDateString()}
                </Text>
              </View>
            </View>
          ) : (
            ''
          )}

          <Pressable onPress={() => navigation.navigate('Buy')}>
            <Text style={styles.textNumber}>View My Holdings</Text>
          </Pressable>

          <View>
            <Pressable
              style={styles.connectButton}
              onPress={viewDepositorsOnPolygonClicked}>
              <View style={styles.connectButton.view}>
                <Text style={styles.connectButton.text}>View on Polygon</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

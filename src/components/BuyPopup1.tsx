import {Avatar, ListItem} from '@rneui/base';
import {useEffect, useState} from 'react';
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
import {getTokenBalance} from '../services/web3Service';
import {useDispatch, useSelector} from 'react-redux';
import userAction from '../redux/actions/user.action';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
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
    height: 60,
    width: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  styleDate: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
    viewData: {
      flexDirection: 'row',
    },
    viewDataImage: {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      justifyItems: 'flex-end',
      flex: 1,
      flexDirection: 'row',
    },
    text: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    textColor: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#7C037B',
    },
  },
  listData: {
    marginTop: 20,
  },
  textNumber: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: '400',
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
  listViewForCoin: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'gray',
      marginBottom: 10,
    },
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  verticleLineAcordian: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
    marginLeft: 10,
    marginRight: 10,
  },
});

export default BuyPopUp1Screen = ({navigation, route}) => {
  const screenName = route?.params?.screenName;
  const [usdtBalance, setUsdtBalance] = useState(0);
  const {web3Data, selectedToken} = useSelector(state => state?.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (web3Data && web3Data.address && selectedToken) {
      const getBalanceUser = async () => {
        const data = await getTokenBalance(
          web3Data?.web3Provider,
          web3Data.address,
          selectedToken,
          web3Data.chainId,
        );
        setUsdtBalance(Number(data).toFixed(2));
      };
      getBalanceUser();
    }
  }, [selectedToken, web3Data]);
  const [expanded, setExpanded] = useState(false);

  const selectToken = token => {
    dispatch(userAction.setToken(token));
    setUsdtBalance(0);
  };

  return (
    <>
      <View style={styles.headerComponent}>
        <Pressable style={styles.headerComponent.box}>
          <Text style={styles.headerComponent.text}>{screenName} Bonds</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.listData}>
            <View
              style={{
                margin: 5,
                backgroundColor: 'rgba(166, 112, 192, 0.1)',
              }}>
              <ScrollView horizontal={true} style={{width: '100%'}}>
                <FlatList
                  data={[
                    {key: 'Pool Name : IndiaAgro'},
                    {key: 'Lock-in Period : 6 Months'},
                    {key: 'Collateral Type : Agricultural Commodity'},
                    {key: 'A.P.Y : 8% Per Annum'},
                  ]}
                  renderItem={({item}) => {
                    return (
                      <View style={{margin: 5}}>
                        <Text
                          style={{
                            fontSize: 13,
                          }}>{`\u2022 ${item.key}`}</Text>
                      </View>
                    );
                  }}
                />
              </ScrollView>
            </View>
          </View>
          <View style={styles.listViewForCoin}>
            <View>
              <Text style={styles.listViewForCoin.text}>Network</Text>
              <ScrollView>
                <ListItem bottomDivider>
                  <Avatar
                    rounded
                    source={require('../assets/polygon-token-1.png')}
                  />
                  <View style={styles.verticleLine}></View>
                  <ListItem.Content>
                    <ListItem.Title>Polygon Network</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </ScrollView>
            </View>
          </View>

          <View style={styles.listViewForCoin}>
            <View>
              <Text style={styles.listViewForCoin.text}>Supported Coin</Text>
              <ScrollView>
                <ListItem.Accordion
                  content={
                    <>
                      <Avatar
                        rounded
                        source={require('../assets/tether1.png')}
                      />
                      <View style={styles.verticleLineAcordian}></View>
                      <ListItem.Content>
                        <ListItem.Title>
                          Tether ({selectedToken})
                        </ListItem.Title>
                      </ListItem.Content>
                    </>
                  }
                  bottomDivider
                  isExpanded={expanded}
                  noIcon={true}
                  onPress={() => {
                    setExpanded(!expanded);
                    selectToken('USDT');
                  }}>
                  <ListItem
                    bottomDivider
                    onPress={() => {
                      setExpanded(!expanded);
                    }}>
                    <Avatar rounded source={require('../assets/tether1.png')} />
                    <View style={styles.verticleLine}></View>
                    <ListItem.Content>
                      <ListItem.Title>Tether (USDT)</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    bottomDivider
                    onPress={() => {
                      setExpanded(!expanded);
                      selectToken('USDC');
                    }}>
                    <Avatar rounded source={require('../assets/tether1.png')} />
                    <View style={styles.verticleLine}></View>
                    <ListItem.Content>
                      <ListItem.Title>USD Coin (USDC)</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                </ListItem.Accordion>
              </ScrollView>
            </View>
          </View>

          <View style={styles.listViewForCoin}>
            <View>
              <Text style={styles.listViewForCoin.text}>
                Available Balances
              </Text>
              <ScrollView>
                <ListItem bottomDivider>
                  <Avatar rounded source={require('../assets/tether1.png')} />
                  <View style={styles.verticleLine}></View>
                  <ListItem.Content>
                    <ListItem.Title>USDT {usdtBalance}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </ScrollView>
            </View>
          </View>
          <View style={styles.buttonContent}>
            <Pressable
              style={styles.connectButton}
              onPress={() =>
                navigation.navigate('Buy2', {
                  balance: usdtBalance,
                })
              }>
              <View style={styles.connectButton.view}>
                <Text style={styles.connectButton.text}>Next</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

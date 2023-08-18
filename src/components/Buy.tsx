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
import {Avatar, Button, Card, List} from 'react-native-paper';
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
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomRadius: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    box: {
      alignSelf: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
      // borderBottomRadius: 1,
      // borderBottomWidth: 1,
      // borderBottomColor: '#7C037B',
      width: '50%',
    },
    boxBorder: {
      alignSelf: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
      borderBottomRadius: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#7C037B',
      width: '50%',
    },
    text: {
      alignSelf: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#7C037B',
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
});

export default BuyScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('BUY');
  const {withdrawData, web3Data, fetchData} = useSelector(state => state?.user);
  useEffect(() => {
    dispatch(userAction.setFetchData(!fetchData));
  }, [web3Data, dispatch]);
  return (
    <>
      <View style={styles.headerComponent}>
        <Pressable
          style={
            activeTab == 'BUY'
              ? styles.headerComponent.boxBorder
              : styles.headerComponent.box
          }
          onPress={() => {
            setActiveTab('BUY');
          }}>
          <Text style={styles.headerComponent.text}>Brú Bonds</Text>
        </Pressable>
        <Pressable
          style={
            activeTab == 'BUY'
              ? styles.headerComponent.box
              : styles.headerComponent.boxBorder
          }
          onPress={() => {
            setActiveTab('WITHDRAW');
          }}>
          <Text style={styles.headerComponent.text}>My Holdings</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}}>
          {activeTab == 'BUY' ? (
            <View style={styles.logoImage}>
              <Card style={{backgroundColor: 'white'}}>
                <Card.Content>
                  <View style={styles.styleDate}>
                    <View>
                      <View style={styles.styleDate.viewData}>
                        <Text
                          variant="titleLarge"
                          style={styles.styleDate.text}>
                          Pool Name:
                        </Text>
                        <Text
                          variant="titleLarge"
                          style={styles.styleDate.textColor}>
                          India Agro
                        </Text>
                      </View>
                      <Text variant="titleLarge" style={styles.text}>
                        A.P.Y: 8% Per Annum
                      </Text>
                    </View>
                    <View style={styles.styleDate.viewDataImage}>
                      <Image
                        style={styles.logoImageImg}
                        source={require('./../assets/sprout-1.png')}
                      />
                    </View>
                  </View>

                  <View style={styles.listData}>
                    <View
                      style={{
                        margin: 5,
                        backgroundColor: 'rgba(166, 112, 192, 0.1)',
                      }}>
                      <ScrollView horizontal={true} style={{width: '100%'}}>
                        <FlatList
                          data={[
                            {key: 'Lock-in Period : 6 Months'},
                            {key: 'Collateral Type : Agricultural Commodity'},
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
                  <Text variant="titleLarge" style={styles.textNumber}>
                    Show on Polygon Network
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <View style={styles.buttonContent}>
                    <Pressable style={styles.connectButton}>
                      <View style={styles.connectButton.view}>
                        <Text
                          style={styles.connectButton.text}
                          onPress={() =>
                            navigation.navigate('Buy1', {
                              screenName: 'Buy',
                            })
                          }>
                          Buy Bond
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </Card.Actions>
              </Card>
            </View>
          ) : (
            <View style={styles.logoImage}>
              <Card style={{backgroundColor: 'white'}}>
                <Card.Content>
                  <View style={styles.styleDate}>
                    <View>
                      <View style={styles.styleDate.viewData}>
                        <Text
                          variant="titleLarge"
                          style={styles.styleDate.text}>
                          Pool Name:
                        </Text>
                        <Text
                          variant="titleLarge"
                          style={styles.styleDate.textColor}>
                          India Agro
                        </Text>
                      </View>
                      <Text variant="titleLarge" style={styles.text}>
                        A.P.Y: 8% Per Annum
                      </Text>
                    </View>
                    <View style={styles.styleDate.viewDataImage}>
                      <Image
                        style={styles.logoImageImg}
                        source={require('./../assets/sprout-1.png')}
                      />
                    </View>
                  </View>

                  <View style={styles.listData}>
                    <View
                      style={{
                        margin: 5,
                        backgroundColor: 'rgba(166, 112, 192, 0.1)',
                      }}>
                      <ScrollView horizontal={true} style={{width: '100%'}}>
                        <FlatList
                          data={[
                            {key: 'Collateral Type : Agricultural Commodity'},
                            {
                              key: `Balance in Pool : USD ${withdrawData?.bondAmount}`,
                            },
                            {
                              key: `Withdrawable Bal. : USDT ${withdrawData?.totalWithdrawableAmount}`,
                            },
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
                  <Text variant="titleLarge" style={styles.textNumber}>
                    Show on Polygon Network
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <View style={styles.buttonContent}>
                    <Pressable style={styles.connectButton}>
                      <View style={styles.connectButton.view}>
                        <Text
                          style={styles.connectButton.text}
                          onPress={() =>
                            navigation.navigate('WithdrawTx', {
                              screenName: 'Withdraw',
                            })
                          }>
                          Withdraw
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </Card.Actions>
              </Card>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

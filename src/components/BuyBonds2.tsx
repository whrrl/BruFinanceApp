import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import LineBeforeText from './LineBeforeText';
import PercentageSlider from './percentageSlider';
import userAction from '../redux/actions/user.action';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  List,
} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {environment} from '../environments/environment';
import {
  approveToken,
  buyBonds,
  getTokenAllowance,
} from '../services/web3Service';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  square: {
    marginTop: 5,
    width: '100%', // Adjust the width as per your requirement
    height: 180, // Adjust the height as per your requirement
    borderWidth: 1,
    borderColor: '#ccc',
    // justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    // Adjust the width as per your requirement
    width: '100%',
    height: 60,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    // Adjust the font size, color, and other text-related styles
    fontSize: 16,
    color: '#000',
  },
  greySquare: {
    width: 80,
    height: 50,
    backgroundColor: '#ccc',
    marginRight: 8,
    paddingLeft: 10,
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
});
export default BuyBondsScreen = ({navigation, route}) => {
  let balance = route?.params?.balance;
  const [amount, setAmount] = useState('0');
  const [platformFees, setPlatformFees] = useState(0);
  const [platformFeesRate, setPlatformFeesRate] = useState(0.01);
  const [totalLendAmount, setTotalLendAmount] = useState(0);
  const [allowanceBalance, setAllowance] = useState(0);
  const {web3Data, selectedToken, fetchData} = useSelector(
    state => state?.user,
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const calculateFees = val => {
    if (val > 0) {
      setAmount(`${val}`);
      let fees = val * platformFeesRate;
      setPlatformFees(fees);
      setTotalLendAmount(fees + val);
      return;
    }
    setPlatformFees(0);
    setAmount('0');
    setTotalLendAmount(0);
  };

  useEffect(() => {
    if (web3Data?.web3Provider) {
      const getData = async () => {
        const getAllowance = await getTokenAllowance(
          web3Data?.web3Provider,
          web3Data.address,
          environment.contracts[web3Data.chainId].tokens[selectedToken].address,
          environment.contracts[web3Data.chainId].RouterAddress,
        );
        setAllowance(getAllowance);
      };
      getData();
    }
  }, [web3Data?.web3Provider, loading]);

  const buyBond = async () => {
    if (web3Data?.web3Provider) {
      try {
        setLoading(true);
        if (amount > balance) {
          toast.show('Enter Valid Amount');
          setLoading(false);
          return;
        }

        if (allowanceBalance < amount) {
          const approveTokenData = await approveToken(
            web3Data?.web3Provider,
            web3Data.address,
            environment.contracts[web3Data.chainId].tokens[selectedToken]
              .address,
            environment.contracts[web3Data.chainId].RouterAddress,
          );
          if (!approveTokenData) {
            toast.show('Error while transaction');
            setLoading(false);
            return;
          }
          return;
        }
        const buyBondData = await buyBonds(
          web3Data?.web3Provider,
          environment.contracts[web3Data.chainId].tokens[selectedToken].address,
          environment.contracts[web3Data.chainId].RouterAddress,
          amount,
        );
        if (buyBondData) {
          dispatch(userAction.setFetchData(!fetchData));
          setLoading(false);
          navigation.navigate('CompleteTransaction', {
            txType: 'BUY',
            data: JSON.stringify({amount}),
            txData: JSON.stringify(buyBondData),
          });
        }
        setLoading(false);
      } catch (error) {
        toast.show('Error while transaction');
        setLoading(false);
      }
    }
  };

  return (
    <>
      <View style={styles.headerComponent}>
        <Pressable style={styles.headerComponent.box}>
          <Text style={styles.headerComponent.text}>Buy Bonds</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.logoImage}>
              <Text style={{marginTop: 30}}>Enter Amount</Text>
              <View style={styles.inputContainer}>
                <View style={{backgroundColor: '#D9D9D9', width: 80}}>
                  <Text
                    style={{
                      padding: 10,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    {selectedToken}
                  </Text>
                </View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="enter amount"
                  value={amount}
                  onChangeText={e => {
                    calculateFees(parseFloat(e));
                  }}
                  maxLength={10}
                />
              </View>
              <Text style={{marginTop: 30}}>Price Breakup</Text>
              <View style={styles.square}>
                <View style={{flexDirection: 'row', marginHorizontal: 10}}>
                  <Text style={{width: '50%', marginLeft: 10, paddingTop: 20}}>
                    Lend Amount{' '}
                  </Text>
                  <Text style={{width: '30%', paddingTop: 20, marginLeft: 70}}>
                    ${amount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    paddingVertical: 10,
                  }}>
                  <Text style={{width: '50%', marginLeft: 10}}>
                    Platform Fee{' '}
                  </Text>
                  <Text style={{width: '30%', marginLeft: 70}}>
                    ${platformFees}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#D9D9D9',
                    justifyContent: 'center',
                    paddingLeft: 20,
                    paddingVertical: 8,
                  }}>
                  <Text
                    style={{
                      width: '50%',
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}>
                    Total Amount{' '}
                  </Text>
                  <Text
                    style={{
                      width: '30%',
                      marginLeft: 70,
                      fontWeight: 'bold',
                    }}>
                    ${totalLendAmount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    paddingTop: 10,
                  }}>
                  <Text style={{width: '50%', marginLeft: 10}}>
                    Bru bons you will receive
                  </Text>
                  <Text style={{width: '30%', marginLeft: 70}}>${amount}</Text>
                </View>
              </View>
              <View style={styles.buttonContent}>
                <Pressable
                  style={styles.connectButton}
                  onPress={() => {
                    buyBond();
                  }}>
                  <View style={styles.connectButton.view}>
                    <Text style={styles.connectButton.text}>
                      {allowanceBalance > 0 ? 'Buy Now' : 'Approve'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

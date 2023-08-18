import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import MyTransectionList from './MyTransectionList';
import {useDispatch, useSelector} from 'react-redux';
import {
  ClaimBond,
  WithdrawBond,
  getPstTransactions,
} from '../services/web3Service';
import {Button} from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToast} from 'react-native-toast-notifications';
import {Dialog} from '@rneui/themed';
import {ActivityIndicator} from 'react-native-paper';
import userAction from '../redux/actions/user.action';
// import { white } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 350,
  },
  transactionBox: {
    width: '100%',
    backgroundColor: 'red',
    height: 300,
  },
  amount: {
    padding: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    // fontSize: 16,
    // borderWidth: 1,
    // borderColor: 'white',
    // borderRadius:30,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 28,
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
      fontSize: 13,
      lineHeight: 18,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },
});
export default MyTransactionWithdraw = ({navigation}) => {
  const {withdrawData, web3Data, fetchData} = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(userAction.setFetchData(!fetchData));
  }, [dispatch]);

  const claimBond = async ele => {
    try {
      setLoading(true);
      const sendTransaction = await ClaimBond(
        web3Data?.web3Provider,
        ele,
        web3Data.chainId,
      );
      if (sendTransaction) {
        dispatch(userAction.setFetchData(!fetchData));
        setLoading(false);
        navigation.navigate('CompleteTransaction', {
          txType: 'claimBond',
          data: JSON.stringify(ele),
          txData: JSON.stringify(sendTransaction),
        });
      }
      setLoading(false);
    } catch (error) {
      toast.show('Error while transaction');
      setLoading(false);
      console.log('%c Line:78 🍿 error', 'color:#2eafb0', error);
    }
  };

  const withdrawBond = async ele => {
    try {
      setLoading(true);
      const sendTransaction = await WithdrawBond(
        web3Data?.web3Provider,
        web3Data.address,
        ele,
        web3Data.chainId,
      );
      if (sendTransaction) {
        dispatch(userAction.setFetchData(!fetchData));
        setLoading(false);
        navigation.navigate('CompleteTransaction', {
          txType: 'claimBond',
          data: JSON.stringify(ele),
          txData: JSON.stringify(sendTransaction),
        });
      }
      setLoading(false);
    } catch (error) {
      toast.show('Error while transaction');
      setLoading(false);
      console.log('%c Line:78 🍿 error', 'color:#2eafb0', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : withdrawData?.tokenAmount &&
            withdrawData.tokenAmount.length > 0 ? (
            withdrawData.tokenAmount.map(data => (
              <View
                key={data?.time}
                style={{
                  backgroundColor: 'white',
                  width: '95%',
                  marginTop: 15,
                  alignSelf: 'center',
                  height: 130,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomEndRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginTop: 20,
                  }}>
                  <Text style={{width: '30%', marginLeft: 20, color: 'gray'}}>
                    Tx Id:{' '}
                  </Text>
                  <Text style={{width: '30%', color: 'black', marginLeft: -22}}>
                    {data?.bondAmount}
                  </Text>
                  <Text style={{width: '40%', marginLeft: 50, color: 'gray'}}>
                    Amount
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginTop: 6,
                  }}>
                  <Text style={{width: '30%', marginLeft: 20, color: 'gray'}}>
                    Date:
                  </Text>
                  <Text style={{width: '30%', color: 'black', marginLeft: -22}}>
                    {data?.depositTime}
                  </Text>
                  <Text
                    style={{
                      width: '40%',
                      color: 'green',
                      marginLeft: 50,
                      fontSize: 20,
                    }}>
                    {data?.bondAmount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginTop: 6,
                  }}>
                  <View style={{width: '40%', marginLeft: 20}}>
                    <Button
                      disabled={data?.withdrawn}
                      onPress={() => {
                        withdrawBond(data);
                      }}>
                      {' '}
                      Withdraw
                    </Button>
                  </View>
                  <View style={{width: '40%', marginLeft: 20}}>
                    <Button
                      disabled={data?.bondClaimed}
                      onPress={() => {
                        claimBond(data);
                      }}>
                      {' '}
                      Claim
                    </Button>
                  </View>
                </View>
              </View>
            ))
          ) : (
            ''
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

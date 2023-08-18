import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getPstTransactions} from '../services/web3Service';
import userAction from '../redux/actions/user.action';

// import { white } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
  },
  transactionBox: {
    width: '100%',
    backgroundColor: 'red',
    height: 100,
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
  // text: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   // text-fill-color and -webkit-text-fill-color are not supported in React Native
  //   color: 'transparent',
  // },

  // container1:{
  //   position: 'absolute',
  //   width: 136,
  //   height: 18,
  //   left: 93,
  //   top: 202
  // },
  // myStyles:{
  //  width: 360, // Set your desired width
  // height: 80, // Set your desired height
  // backgroundColor: 'white',
  // borderWidth: 1,
  // borderColor: 'white',
  // marginLeft:15

  // },
  // row: {
  //   flex: 1,
  //   flexDirection:"row",
  //   padding:20,
  //   backgroundColor:'white'
  // },

  // container: {
  //   width: 200, // Set your desired width
  //   height: 100, // Set your desired height
  //   backgroundColor: 'white',
  //   borderWidth: 1,
  //   borderColor: '#000',
  // },
});
export default TransactionScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {transactions, web3Data, fetchData} = useSelector(state => state?.user);

  React.useEffect(() => {
    if (web3Data?.web3Provider) {
      const getFunc = async () => {
        const trx = await getPstTransactions(
          web3Data.web3Provider,
          web3Data.address,
          web3Data.chainId,
        );
        dispatch(userAction.setTransaction(trx));
      };
      getFunc();
    }
  }, [web3Data, dispatch, fetchData]);

  return (
    <View style={styles.container}>
      {transactions && transactions.length > 0
        ? transactions.map(data => (
            <View
              key={data?.transactionHash}
              style={{
                backgroundColor: 'white',
                width: '95%',
                marginTop: 15,
                alignSelf: 'center',
                height: 110,
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
                  {data?.transactionHash.slice(0, 10)}...
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
                  {data?.time.toLocaleDateString()}
                </Text>
                <Text
                  style={{
                    width: '40%',
                    color: 'green',
                    marginLeft: 50,
                    fontSize: 20,
                  }}>
                  {data?.amount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginTop: 6,
                }}>
                <Text style={{width: '30%', marginLeft: 20, color: 'gray'}}>
                  Description:
                </Text>
                <Text style={{width: '30%', color: 'black', marginLeft: -22}}>
                  {data?.type}
                </Text>
                <Text
                  style={{
                    width: '40%',
                    color: 'black',
                    marginLeft: 50,
                    color: 'gray',
                  }}>
                  {data?.coin}
                </Text>
              </View>
            </View>
          ))
        : ''}
    </View>
  );
};

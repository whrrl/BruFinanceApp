import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/Home';
import ProfileScreen from './components/Profile';
import TransactionScreen from './components/Transactions';
import BuyBondsScreen from './components/BuyBonds2';
import LoadingScreen from './components/Loading';
import WalletModelScreen from './components/WalletModel';
import HeaderLogo from './components/header/Header';
import HeaderLogoRight from './components/header/headerRigt';
import BuyScreen from './components/Buy';
import BuyPopUp1Screen from './components/BuyPopup1';
import CompleteTransaction from './components/CompleteTransactions';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet} from 'react-native';
import {getPolAddress, getTotalDepositors} from './services/apiService';
import {useDispatch, useSelector} from 'react-redux';
import userAction from './redux/actions/user.action';
import {getPstTransactions, getUserBondIds} from './services/web3Service';
import MyTransactionWithdraw from './components/MyTransectionList';
import {useAddress, useChainId, useSigner} from '@thirdweb-dev/react-native';
import {environment} from './environments/environment';
import {useToast} from 'react-native-toast-notifications';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  logoImageImg: {
    height: 25,
    width: 25,
  },
});

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: true,
      })}>
      <Tab.Screen
        name="Brú Finance Stats"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({color, size}) => (
          //   <Image
          //     style={styles.logoImageImg}
          //     source={require('./assets/home-Icon.png')}
          //   />
          // ),
        }}
      />
      <Tab.Screen
        name="Buy"
        component={BuyScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Trxn" component={TransactionScreen} />
      {/* <Tab.Screen name="Buy Bonds" component={CompleteTransaction} /> */}
    </Tab.Navigator>
  );
}

const Routes = () => {
  const dispatch = useDispatch();
  const {web3Data, fetchData} = useSelector(state => state?.user);

  const address = useAddress();
  const signer = useSigner();
  const chainId = useChainId();
  const toast = useToast();
  React.useEffect(() => {
    if (address && signer && chainId) {
      const func = async () => {
        // const {chainId} = await web3Provider.getNetwork();
        // console.log('%c Line:179 🍅 chainId', 'color:#b03734', chainId);
        if (environment.supportedNetwork.includes(chainId)) {
          dispatch(
            userAction.setWeb3Data({
              address: address,
              isConnected: true,
              web3Provider: signer,
              chainId: chainId,
              provider: 'thirdWEb',
            }),
          );
        } else {
          toast.show('Connect with Polygon Mainnet');
        }
      };
      func();
    }
  }, [dispatch, address, signer, chainId]);

  React.useEffect(() => {
    const getData = async () => {
      let data = await getTotalDepositors();
      dispatch(userAction.setHomeTotalUser(data?.totalAssets));
      dispatch(userAction.setHomeTotalAssets(data?.totalAssetsValue));
    };
    getData();
  }, [dispatch, fetchData]);

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

  React.useEffect(() => {
    if (web3Data?.web3Provider) {
      const getFunc = async () => {
        let withData = await getUserBondIds(
          web3Data.web3Provider,
          web3Data.address,
          web3Data.chainId,
          environment.contracts[web3Data.chainId].PoolAddress,
        );
        dispatch(userAction.setWithdrawData(withData));
      };
      getFunc();
    }
  }, [web3Data, dispatch, fetchData]);

  React.useEffect(() => {
    dispatch(userAction.setFetchData(!fetchData));
  }, [web3Data, dispatch]);

  React.useEffect(() => {
    const getData = async () => {
      const getPoolAddress = await getPolAddress();
      console.log(
        '%c Line:141 🍞 getPoolAddress',
        'color:#e41a6a',
        getPoolAddress,
      );
      dispatch(userAction.setPoolAddress(getPoolAddress));
    };
    getData();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({navigation}) => ({
          headerTitle: props => <HeaderLogo navigation={navigation} />,
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#7C037B',
            height: 300,
          },
          headerRight: () => <HeaderLogoRight navigation={navigation} />,
        })}>
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{title: '', headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            title: '',
          }}
        />
        <Stack.Screen
          name="Wallet"
          component={WalletModelScreen}
          options={{title: 'Choose Wallet'}}
        />
        <Stack.Screen name="Buy" component={BuyScreen} options={{title: ''}} />
        <Stack.Screen
          name="Buy1"
          component={BuyPopUp1Screen}
          options={{title: 'Buy Bonds', headerShown: false}}
        />
        <Stack.Screen
          name="CompleteTransaction"
          component={CompleteTransaction}
          options={{title: 'Buy Bonds', headerShown: false}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Transaction" component={TransactionScreen} />
        <Stack.Screen name="WithdrawTx" component={MyTransactionWithdraw} />
        <Stack.Screen
          name="Buy2"
          component={BuyBondsScreen}
          options={{title: 'Buy Bonds', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

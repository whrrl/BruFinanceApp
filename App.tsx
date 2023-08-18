/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Routes from './src/routes';
import {Provider} from 'react-redux';
import configureStore from './src/redux/store';
import {ToastProvider} from 'react-native-toast-notifications';
import {ThirdwebProvider} from '@thirdweb-dev/react-native';
import {
  metamaskWallet,
  trustWallet,
  localWallet,
  walletConnect,
} from '@thirdweb-dev/react-native';
import {Mumbai, LineaTestnet} from '@thirdweb-dev/chains';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// clientID : 8b47ef3dc283abe26da04b0549a7d6e8
// secretKey: lvFDYwWtzXeIqB9q_PAFPQnTeSAoYq1cROSPe4Fq9cvNhFfXBRSyVVv9mRfnKYFOROeyC2VbzAyIjqbavhbrsw

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const store = configureStore();

function App(): JSX.Element {
  return (
    <>
      <ToastProvider>
        <ThirdwebProvider
          activeChain={'mumbai'}
          supportedChains={[Mumbai, LineaTestnet]}
          clientId={'8b47ef3dc283abe26da04b0549a7d6e8'}
          supportedWallets={[
            metamaskWallet({
              projectId: 'e242779dc9c2aab2257cb78f3c01664c', // optional but recommended for production
            }),
            trustWallet({
              projectId: 'e242779dc9c2aab2257cb78f3c01664c', // optional but recommended for production
            }),
            walletConnect({
              projectId: 'e242779dc9c2aab2257cb78f3c01664c', // optional but recommended for production
            }),
          ]}
          dAppMeta={{
            name: 'Example App',
            description: 'This is an example app',
            logoUrl: 'https://example.com/logo.png',
            url: 'https://example.com',
          }}>
          <Provider store={store}>
            <Routes />
          </Provider>
        </ThirdwebProvider>
      </ToastProvider>
    </>
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <Pressable onPress={open}>
    //       <Text>{isConnected ? 'View Account' : 'Connect'}</Text>
    //     </Pressable>
    //     <View
    //       style={{
    //         backgroundColor: isDsarkMode ? Colors.black : Colors.white,
    //       }}>
    //       {/* <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.tsx</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section> */}
    //       {/* <LearnMoreLinks /> */}
    //       <WalletConnectModal
    //         projectId={projectId}
    //         providerMetadata={providerMetadata}
    //       />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

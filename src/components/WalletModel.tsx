import { ethers } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Button,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import userAction from "../redux/actions/user.action";
import { Linking } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import { ConnectWallet } from "@thirdweb-dev/react-native";
import { useDispatch, useSelector } from "react-redux";
import { environment } from "../environments/environment";
import { useToast } from "react-native-toast-notifications";
import MetaMaskSDK from "@metamask/sdk";

let canOpenLink = true;
const sdk = new MetaMaskSDK({
    openDeeplink: (link: string) => {
        if (canOpenLink) {
            Linking.openURL(link);
        }
    },
    timer: BackgroundTimer,
    enableDebug: true,
    dappMetadata: {
        url: "devreactnative",
        name: "devreactnative",
    },
    logging: {
        developerMode: true,
        plaintext: true,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
    },
    metamaskButton: {
        marginBottom: 40,
    },
    metamask: {
        flexDirection: "row",
    },
    metamaskLogoImageImg: {
        height: 36,
        width: 36,
        marginRight: 20,
    },
    appButton: {
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: "transparent",
        borderColor: "#CD6116",
        borderWidth: 2,
        borderLeftWidth: 8,
        width: "100%",
        text: {
            alignSelf: "center",
            justifyContent: "center",
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "bold",
            letterSpacing: 0.25,
            color: "#CD6116",
            width: "100%",
        },
    },
    walletConnectButton: {
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: "transparent",
        borderColor: "#0973FE",
        borderWidth: 2,
        borderLeftWidth: 8,
        width: "100%",
        text: {
            alignSelf: "center",
            justifyContent: "center",
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "bold",
            letterSpacing: 0.25,
            color: "#0973FE",
            width: "100%",
        },
    },
    disConnectButton: {
        marginTop: 50,
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: "transparent",
        borderColor: "gray",
        borderWidth: 2,
        borderLeftWidth: 8,
        width: "100%",
        text: {
            alignSelf: "center",
            justifyContent: "center",
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "bold",
            letterSpacing: 0.25,
            color: "black",
            width: "100%",
        },
    },
    textMore: {
        marginTop: 30,
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: "transparent",
        width: "100%",
        text: {
            alignSelf: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 25,
            fontSize: 16,
            lineHeight: 21,
            letterSpacing: 0.25,
            width: "100%",
            color: "gray",
        },
        text2: {
            marginTop: -30,
            alignSelf: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 25,
            fontSize: 16,
            lineHeight: 21,
            letterSpacing: 0.25,
            width: "100%",
            color: "#7C037B",
        },
        line: {
            marginTop: 30,
            borderRadius: 1,
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: "gray",
            // borderBottomColor: 'black',
            // borderBottomWidth: StyleSheet.hairlineWidth,
            // borderBottomStyle: 'dashed',
            // borderBottomRadius: 1,
        },
    },
});

export default WalletModelScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    // const {open, isConnected, address, provider} = useWalletConnectModal();
    const { web3Data } = useSelector((state) => state?.user);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
    const [ethereum] = useState(sdk.getProvider());
    const [response, setResponse] = useState("");
    const [account, setAccount] = useState();
    const [chain, setChain] = useState();
    const [balance, setBalance] = useState();
    const [connected, setConnected] = useState(false);
    const [status, setConnectionStatus] = useState();
    const [ready, setReady] = useState(false);
    const shouldInit = useRef(true);

    // initialize sdk
    useEffect(() => {
        if (!shouldInit.current) {
            return;
        }
        shouldInit.current = false;

        sdk.init().then(() => {
            setReady(true);
        });
    });

    const getBalance = async () => {
        if (!ethereum?.selectedAddress) {
            return;
        }
        const bal =
            (await provider?.getBalance(ethereum?.selectedAddress)) ??
            ethers.BigNumber.from(0);
        setBalance(ethers.utils.formatEther(bal));
    };

    useEffect(() => {
        if (!ethereum) {
            console.warn("invalid provider state");
            return;
        }

        try {
            setProvider(
                new ethers.providers.Web3Provider(
                    ethereum as unknown as ethers.providers.ExternalProvider,
                ),
            );

            console.debug(
                `useffect ethereum.selectedAddress=${ethereum.selectedAddress}`,
            );
            if (ethereum.selectedAddress) {
                setConnected(true);
                setAccount(ethereum.selectedAddress);
            }

            ethereum.on("connect", () => {
                setConnected(true);
            });

            ethereum.on("chainChanged", (newChain: unknown) => {
                console.log('useEffect::ethereum on "chainChanged"', newChain);
                // setChain(newChain * 1);
                dispatch(userAction.setWeb3Data({}));
            });

            ethereum.on("_initialized", () => {
                console.log(
                    `useEffect::ethereum on "_initialized" ethereum.selectedAddress=${ethereum.selectedAddress} ethereum.chainId=${ethereum.chainId}`,
                );
                if (ethereum.selectedAddress) {
                    setAccount(ethereum?.selectedAddress);
                    getBalance();
                }
                if (ethereum.chainId) {
                    console.log(
                        "%c Line:276 🍰 ethereum.chainId",
                        "color:#42b983",
                        ethereum.chainId * 1,
                    );
                    setChain(ethereum.chainId * 1);
                }
            });

            ethereum.on("accountsChanged", (_accounts: unknown) => {
                const accounts = _accounts as string[];
                console.log(
                    'useEffect::ethereum on "accountsChanged"',
                    accounts,
                );
                if (accounts.length > 0 && accounts[0] !== account) {
                    setAccount(accounts?.[0]);
                    getBalance();
                }
            });

            ethereum.on("disconnect", () => {
                console.log('useEffect::ethereum on "disconnect"');
                setConnected(false);
                dispatch(userAction.setWeb3Data({}));
            });

            // sdk.on(
            //   EventType.CONNECTION_STATUS,
            //   (_connectionStatus: ConnectionStatus) => {
            //     setConnectionStatus(_connectionStatus);
            //   },
            // );
        } catch (err) {
            console.log("errror", err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connect = async () => {
        try {
            const result = (await ethereum?.request({
                method: "eth_requestAccounts",
            })) as string[];
            console.log("RESULT", result?.[0]);
            setConnected(true);
            setAccount(result?.[0]);
        } catch (e) {
            console.log("ERROR", e);
        }
    };

    useEffect(() => {
        if (connected && chain && provider && account) {
            console.log(
                "%c Line:328 🌭 provider",
                "color:#2eafb0",
                provider.getSigner(),
            );
            dispatch(
                userAction.setWeb3Data({
                    address: account,
                    isConnected: connected,
                    web3Provider: provider.getSigner(),
                    chainId: chain,
                    provider: "Metamask",
                }),
            );
        }
    }, [dispatch, connected, chain, provider, account]);

    // const web3Provider = useMemo(
    //   () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
    //   [provider],
    // );
    // const ethereum = MMSDK.getProvider();

    // const provider = new ethers.providers.Web3Provider(ethereum);

    // const mWeb3Provider = useMemo(
    //   () => (ethereum ? new ethers.providers.Web3Provider(ethereum) : undefined),
    //   [ethereum],
    // );
    // const toast = useToast();
    // const [accounts, setAccounts] = useState([]);

    // useEffect(() => {
    //   if (isConnected && web3Provider && provider) {
    //     const func = async () => {
    //       const {chainId} = await web3Provider.getNetwork();
    //       console.log('%c Line:179 🍅 chainId', 'color:#b03734', chainId);
    //       if (environment.supportedNetwork.includes(chainId)) {
    //         dispatch(
    //           userAction.setWeb3Data({
    //             address: address,
    //             isConnected: isConnected,
    //             web3Provider: web3Provider,
    //             chainId: chainId,
    //             provider: 'WalletConnect',
    //           }),
    //         );
    //       } else {
    //         disconnect();
    //         toast.show('Connect with Polygon Mainnet');
    //       }
    //     };
    //     func();
    //   }
    // }, [dispatch, web3Provider, isConnected, address]);

    // const connectMetamask = async () => {
    //   try {
    //     const newAccounts = await ethereum.request({
    //       method: 'eth_requestAccounts',
    //     });

    //     console.log('%c Line:222 🍕 newAccounts', 'color:#ffdd4d', newAccounts);
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   // const provider = new ethers.providers.Web3Provider(ethereum, 'any');

    //   // console.log('%c Line:166 🍞', 'color:#ed9ec7');
    //   const {chainId} = await mWeb3Provider.getNetwork();

    //   // // const provider = useMemo(
    //   // //   () =>
    //   // //     provider ? new ethers.providers.Web3Provider(ethereum) : undefined,
    //   // //   [provider],
    //   // // );
    //   // // console.log('%c Line:184 🍐 provider', 'color:#ea7e5c', provider);
    //   // // console.log("%c Line:182 🎂 ethereum", "color:#33a5ff", ethereum.on.);

    //   // const provider = new ethers.providers.Web3Provider(ethereum, 'any');

    //   await ethereum.on('connect', connect => {
    //     console.log('%c Line:188 🍯 connect', 'color:#465975', connect);
    //     dispatch(
    //       userAction.setWeb3Data({
    //         address: ethereum.selectedAddress,
    //         isConnected: true,
    //         web3Provider: mWeb3Provider,
    //         chainId: chainId * 1,
    //         provider: 'Metamask',
    //       }),
    //     );
    //   });
    // };
    // ethereum.on('connect', connect => {
    //   console.log('%c Line:188 🍯 connect', 'color:#465975', connect);
    //   setAccounts([ethereum.selectedAddress]);
    // });
    // ethereum.on('disconnect', connect => {
    //   console.log('%c Line:188 🍯 connect', 'color:#465975', connect);
    //   // setAccounts([ethereum.selectedAddress]);
    //   dispatch(userAction.setWeb3Data());
    // });

    // useEffect(() => {
    //   dispatch(
    //     userAction.setWeb3Data({
    //       address: ethereum.selectedAddress,
    //       isConnected: true,
    //       web3Provider: mProvider,
    //       chainId: '80001',
    //       provider: 'Metamask',
    //     }),
    //   );
    // }, [accounts]);

    const disconnect = () => {
        // if (provider && isConnected) {
        //   provider.disconnect();
        //   // dispatch(userAction.setWeb3Data());
        // }
        dispatch(userAction.setWeb3Data());
    };
    return (
        <>
            <SafeAreaView style={styles.container}>
                {/* <>
                    <ConnectWallet
                        theme="dark"
                        modalTitle="Select a wallet"
                        buttonTitle="Connect Wallet"
                    />
                </> */}
                {web3Data &&
                web3Data?.chainId &&
                web3Data?.isConnected &&
                web3Data.isConnected ? (
                    <View>
                        <Text> Connected Address : {web3Data?.address}</Text>
                        <Text>
                            {" "}
                            Connected Network :{" "}
                            {environment.contracts[web3Data.chainId].name}
                        </Text>

                        <View>
                            <Pressable
                                style={styles.disConnectButton}
                                onPress={disconnect}
                            >
                                <View style={styles.metamask}>
                                    <Text style={styles.disConnectButton.text}>
                                        Disconnect Wallet
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.metamaskButton}>
                            <Pressable
                                style={styles.appButton}
                                onPress={connect}
                            >
                                <View style={styles.metamask}>
                                    <Image
                                        style={styles.metamaskLogoImageImg}
                                        source={require("./../assets/metamask-1.png")}
                                    />
                                    <Text style={styles.appButton.text}>
                                        Metamask
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                        {/* <View>
              <Pressable style={styles.walletConnectButton}>
                <View style={styles.metamask}>
                  <Image
                    style={styles.metamaskLogoImageImg}
                    source={require('./../assets/walletconnect-1.png')}
                  />
                  <Text style={styles.walletConnectButton.text}>
                    Wallet Connect
                  </Text>
                </View>
              </Pressable>
            </View> */}
                        <ConnectWallet />
                        {/* <View style={styles.textMore}>
                            <Text style={styles.textMore.text}>
                                More wallets coming soon :)...
                            </Text>
                            <View style={styles.textMore.line}></View>
                        </View>
                        <View style={styles.textMore}>
                            <Text style={styles.textMore.text}>
                                Don't have a wallet ?
                            </Text>
                        </View>
                        <View style={styles.textMore}>
                            <Pressable>
                                <Text style={styles.textMore.text2}>
                                    Create wallet
                                </Text>
                            </Pressable>
                        </View> */}
                    </>
                )}

                {/* <Button title="walletConect">Wallet Connect</Button> */}
            </SafeAreaView>
        </>
    );
};

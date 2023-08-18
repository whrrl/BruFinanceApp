import {useEffect, useState} from 'react';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Button, Card} from 'react-native-paper';
import {getTotalDepositors} from '../services/apiService';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  cardMain: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  logoImageImg: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 30,
    fontSize: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textNumber: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: 'bold',
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
      fontSize: 12,
      lineHeight: 21,
      fontWeight: '400',
      letterSpacing: 0.25,
      color: '#7C037B',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },
});

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

const viewDepositorsOnPolygonClicked = async () => {
  await Linking.openURL(
    `https://mumbai.polygonscan.com/token/0xBD23D4020c02886b459379386D07b03fB18bEa92`,
  ).catch(err => console.error("Couldn't load page", err));
};
export default HomeScreen = ({navigation}) => {
  const {totalUsers, totalAssets} = useSelector(state => state.user);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.logoImage}>
            <Card>
              <Card.Content>
                <Image
                  style={styles.logoImageImg}
                  source={require('./../assets/tether2.png')}
                />
                <Text variant="titleLarge" style={styles.text}>
                  Total depositors (in numbers)
                </Text>
                <Text variant="titleLarge" style={styles.textNumber}>
                  {totalUsers}
                </Text>
              </Card.Content>
              <Card.Actions>
                <View style={styles.buttonContent}>
                  <Pressable
                    style={styles.connectButton}
                    onPress={viewDepositorsOnPolygonClicked}>
                    <View style={styles.connectButton.view}>
                      <Text style={styles.connectButton.text}>
                        View depositors on polygon network
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </Card.Actions>
            </Card>
          </View>
          <View style={styles.logoImage}>
            <Card>
              <Card.Content>
                <Image
                  style={styles.logoImageImg}
                  source={require('./../assets/tether1.png')}
                />
                <Text variant="titleLarge" style={styles.text}>
                  Total value of assets (in USDT)
                </Text>
                <Text variant="titleLarge" style={styles.textNumber}>
                  {totalAssets}
                </Text>
              </Card.Content>
              <Card.Actions>
                <View style={styles.buttonContent}>
                  <Pressable
                    style={styles.connectButton}
                    onPress={viewDepositorsOnPolygonClicked}>
                    <View style={styles.connectButton.view}>
                      <Text style={styles.connectButton.text}>
                        View assets on polygon network
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

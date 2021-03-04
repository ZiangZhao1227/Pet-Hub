import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, ListItem, Text, Icon, Image} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.sv}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <ImageBackground
              source={require('../assets/bg.png')}
              style={styles.image}
            >
              <View style={styles.form}>
                <Card containerStyle={{backgroundColor: 'lightcyan'}}>
                  {formToggle ? (
                    <>
                      <Card.Title h3> Login</Card.Title>
                      <Card.Divider />
                      <LoginForm navigation={navigation} />
                    </>
                  ) : (
                    <>
                      <Card.Title h3 style={{backgroundColor: 'lightcyan'}}>
                        {' '}
                        Register
                      </Card.Title>
                      <Card.Divider />
                      <RegisterForm navigation={navigation} />
                    </>
                  )}
                  <ListItem
                    onPress={() => {
                      setFormToggle(!formToggle);
                    }}
                    containerStyle={{backgroundColor: 'lightcyan'}}
                  >
                    <ListItem.Content>
                      <Text style={styles.text}>
                        {formToggle
                          ? "Don't have an account yet? Sign up here."
                          : 'Already have an account? Log in here.'}
                      </Text>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                </Card>
              </View>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sv: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    padding: 10,
    color: 'black',
    fontSize: 15,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;

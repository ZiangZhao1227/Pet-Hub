import React, {useContext, useState} from 'react';
import {View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import useLoginForm from '../hooks/LoginHooks';

const LoginForm = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useLoginForm();
  const {postLogin} = useLogin();
  const {setUser, setIsLoggedIn} = useContext(MainContext);

  const doLogin = async () => {
    setLoading(true);
    try {
      const userData = await postLogin(inputs);
      setUser(userData.user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('userToken', userData.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('postLogin error', error.message);
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username:"
        onChangeText={(txt) => handleInputChange('username', txt)}
        leftIcon={{ type: 'font-awesome-5', name: 'user' ,color:"gray"}}
        label="Username"
        labelStyle={{color:"#1ABBD1"}}
      />
      <Input
        autoCapitalize="none"
        placeholder="password:"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        leftIcon={{ type: 'font-awesome-5', name: 'lock' ,color:"gray"}}
        label="Password"
        labelStyle={{color:"#1ABBD1"}}
      />
      <Button
        title="Login"
        titleStyle={{
          fontSize: 20,


        }}
        onPress={doLogin}
        loading={loading}
        buttonStyle={{backgroundColor: '#1ABBD1', size: 20}}
        containerStyle={{borderRadius: 20}}
        icon={
          <Icon
            name="cat"
            type="font-awesome-5"
            size={20}
            color="white"
            style={{marginRight: 14, marginBottom: 3}}
          />
        }
      />
    </View>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;

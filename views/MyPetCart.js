import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const MyPetCart = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} myFilesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

MyPetCart.propTypes = {
  navigation: PropTypes.object,
};

export default MyPetCart;

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const MyFiles = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} myFilesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;

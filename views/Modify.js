import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file_id, userToken);
      console.log('update response', resp);
      setUpdate(update + 1);
      navigation.pop();
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setInputs({
      title: file.title,
      description: file.description,
    });
  }, []);

  const doReset = () => {
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text h4>Update file info</Text>
          {/* TODO: add similar media view than Single.js */}
          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Input
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Update"
            onPress={doUpdate}
            // disabled={
            //   uploadErrors.title !== null || uploadErrors.description !== null
            // }
          />
          <Button title="Reset" onPress={doReset} />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;

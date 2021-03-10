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
      const resp = await updateFile(file.file_id, inputs, userToken);
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
    <ScrollView style={{backgroundColor: 'pink'}}>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card
          containerStyle={{backgroundColor: '#FFDCDC'}}
          borderBottomLeftRadius={54}
        >
          <Text h4 style={{alignSelf: 'center'}}>
            Update pet info
          </Text>
          {/* TODO: add similar media view than Single.js */}
          <Input
            label="title"
            labelStyle={{color: '#1ABBD1'}}
            font="font-awesome-5"
            color="gray"
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
            leftIcon={{
              type: 'font-awesome-5',
              name: 'file-signature',
              color: 'gray',
            }}
          />
          <Input
            label="description"
            labelStyle={{color: '#1ABBD1'}}
            font="font-awesome-5"
            color="gray"
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
            leftIcon={{
              type: 'font-awesome-5',
              name: 'comment-dots',
              color: 'gray',
            }}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Update"
            onPress={doUpdate}
            buttonStyle={{
              backgroundColor: '#1ABBD1',
              size: 20,
              marginBottom: 20,
              borderRadius: 20,
            }}
            // disabled={
            //   uploadErrors.title !== null || uploadErrors.description !== null
            // }
          />
          <Button
            title="Reset"
            onPress={doReset}
            buttonStyle={{
              backgroundColor: '#1ABBD1',
              size: 20,
              marginBottom: 20,
              borderRadius: 20,
            }}
          />
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

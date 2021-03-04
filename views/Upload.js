import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/Variables';
import {Video} from 'expo-av';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {upload} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // add image to formData
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      // console.log('pickImage result', result);
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card containerStyle={{backgroundColor: '#FFDCDC'}} borderBottomLeftRadius={54}>
          <Text h4 style={{alignSelf:'center'}}>

            Upload media file
          </Text>
          {image && (
            <>
              {filetype === 'image' ? (
                <Image
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                />
              ) : (
                <Video
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                  useNativeControls={true}
                />
              )}
            </>
          )}
          <Input
           label="title"
           labelStyle={{color:"#1ABBD1"}}
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
            leftIcon={{ type: 'font-awesome-5', name: 'file-signature' ,color:"gray"}}
          />
          <Input
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
            leftIcon={{ type: 'font-awesome-5', name: 'comment-dots' ,color:"gray"}}
            label="description"
            labelStyle={{color:"#1ABBD1"}}
          />

          <Button
            title="Choose from library"
            onPress={() => pickImage(true)}
            buttonStyle={{backgroundColor: '#1ABBD1', size: 20,marginBottom:20,borderRadius:20}}
          />
          <Button
            title="Use camera"
            onPress={() => pickImage(false)}
            buttonStyle={{backgroundColor: '#1ABBD1', size: 20,marginBottom:20,borderRadius:20}}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Upload file"
            onPress={doUpload}
            disabled={
              uploadErrors.title !== null ||
              uploadErrors.description !== null ||
              image === null
            }
            buttonStyle={{backgroundColor: 'darkorange', size: 20,marginBottom:20,borderRadius:20}}
          />
          <Button
            title="Reset"
            onPress={doReset}
            buttonStyle={{backgroundColor: '#1ABBD1', size: 20,marginBottom:20,borderRadius:20}}
          />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

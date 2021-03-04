import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  Text,
  ListItem,
  Avatar,
  Button,
  Icon,
} from 'react-native-elements';
import {uploadsUrl} from '../utils/Variables';
import {ScrollView} from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {View} from 'react-native';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [image, setImage] = useState(null);
  const {upload} = useMedia();
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const [filetype, setFiletype] = useState('');
  const {getFilesByTag} = useTag();
  const {postTag} = useTag();

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar();
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
      setFiletype(result.type);
      setAvatar(result.uri);
      setImage(result.uri);
    }
  };

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', 'profile');

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
          tag: 'avatar_' + user.user_id,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'How nice!',
        'Profile picture changed',
        [
          {
            text: 'Ok',
            onPress: () => {
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

  return (
    <ScrollView>
      <Card containerStyle={{backgroundColor: '#FFDCDC'}}>
        <Card.Title>
          <Text h1 style={{color: '#1ABBD1'}}>
            {user.username}
          </Text>
        </Card.Title>
        <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />
        <View
          style={[
            {width: '55%', margin: 10, alignSelf: 'center', marginTop: 18},
          ]}
        >
          <Button
            icon={
              <Icon
                name="hand-pointer"
                type="font-awesome-5"
                size={20}
                color="white"
                containerStyle={{marginHorizontal: 10}}
              />
            }
            iconLeft
            title="Select an image"
            buttonStyle={{
              backgroundColor: '#1ABBD1',
              size: 20,
              borderRadius: 20,
            }}
            raised
            onPress={() => pickImage(true)}
          />
        </View>
        <View
          style={[
            {width: '65%', margin: 10, alignSelf: 'center', marginBottom: 18},
          ]}
        >
          <Button
            icon={
              <Icon
                name="image"
                type="font-awesome-5"
                size={20}
                color="white"
                containerStyle={{marginHorizontal: 10}}
              />
            }
            iconLeft
            title="Upload profile image"
            buttonStyle={{backgroundColor: 'orange'}}
            raised
            onPress={doUpload}
            buttonStyle={{
              backgroundColor: '#1ABBD1',
              size: 20,
              borderRadius: 20,
            }}
          />
        </View>

        <ListItem>
          <Avatar icon={{name: 'email', color: '#1ABBD1'}} />
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem bottomDivider>
          <Avatar
            icon={{name: 'user', type: 'font-awesome', color: '#1ABBD1'}}
          />
          <Text>{user.full_name}</Text>
        </ListItem>
        <ListItem bottomDivider onPress={() => navigation.push('My Pet Cart')}>
          <Avatar
            icon={{name: 'crow', type: 'font-awesome-5', color: '#1ABBD1'}}
          />
          <ListItem.Content>
            <ListItem.Title>Adopt a pet page</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem bottomDivider onPress={() => navigation.push('My Files')}>
          <Avatar
            icon={{
              name: 'heart',
              type: 'font-awesome-5',
              color: '#1ABBD1',
            }}
          />
          <ListItem.Content>
            <ListItem.Title>My pets for adoption page</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem bottomDivider onPress={logout}>
          <Avatar icon={{name: 'logout', color: '#1ABBD1'}} />
          <ListItem.Content>
            <ListItem.Title>Logout</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, aspectRatio: 1},
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;

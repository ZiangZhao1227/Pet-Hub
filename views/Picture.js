import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View,} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {Avatar, Card, ListItem, Text, Icon} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';

const Picture = ({route}) => {
  const { number } = route.params;
  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getFilesByTag} = useTag();
  const {getUser} = useUser();
  const [videoRef, setVideoRef] = useState(null);



  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();


    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  return (
    <ScrollView>
      <Card containerStyle={{backgroundColor: '#FFDCDC'}}>
        <View style={{justifyContent: 'center'}}>
          <Avatar
            source={{uri: avatar}}
            rounded
            size="large"
            containerStyle={{alignSelf: 'center'}}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
              margin: 20,
            }}
          >
            You added {owner.username}'s pet in the cart.
          </Text>
        </View>
        <View style={{flexDirection:"row",justifyContent:"center"}}>
          <Icon
            name="grin-hearts"
            type="font-awesome-5"
            color="darkcyan"
            size="37"
            containerStyle={{marginBottom:15}}
          />
        </View>


        <Card.Divider />
        <ListItem containerStyle={{backgroundColor: '#FFDCDC'}}></ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

Picture.propTypes = {
  route: PropTypes.object,
};

export default Picture;

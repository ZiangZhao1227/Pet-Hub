import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {Avatar, Card, Text} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';

const Single = ({route}) => {
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
    <ScrollView style={{backgroundColor: 'pink'}}>
      <Card
        containerStyle={{backgroundColor: 'lightcyan', borderColor: 'blue'}}
        borderBottomLeftRadius={54}
      >
        <Card.Title h1> {file.title}</Card.Title>
        <Card.Divider />
        {file.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onError={(err) => {
              console.error('video', err);
            }}
            posterSource={{uri: uploadsUrl + file.screenshot}}
          />
        )}
        <Card.Divider />
        <Text style={styles.description}>{file.description}</Text>
        <Card.Divider />

        <Card.Title style={{color: 'grey'}}>
          {moment(file.time_added).format('LLL')}
        </Card.Title>
      </Card>

      <Card
        containerStyle={{backgroundColor: 'lightyellow', borderColor: 'blue'}}
        borderTopRightRadius={54}
      >
        <Avatar source={{uri: avatar}} rounded size="large" />
        <Card.Title h4>Contact Information</Card.Title>
        <Card.Divider style={{backgroundColor: 'gold', height: 15}} />
        <Text style={{marginBottom: 10}}>Owner name: {owner.username}</Text>
        <Card.Divider style={{backgroundColor: 'blue'}} />
        <Text style={{marginBottom: 10}}>Owner email: {owner.email}</Text>
        <Card.Divider style={{backgroundColor: 'blue'}} />
        <Text style={{marginBottom: 10}}>
          Owner fullname: {owner.full_name}
        </Text>
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
  description: {
    marginBottom: 10,
    fontSize: 19,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;

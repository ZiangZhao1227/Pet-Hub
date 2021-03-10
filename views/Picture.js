import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {Avatar, Card, ListItem, Text, Icon} from 'react-native-elements';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';

const Picture = ({route}) => {
  const {fileTitle, ownername, pet} = route.params;

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

  useEffect(() => {
    unlock();

    return () => {
      lock();
    };
  }, []);

  return (
    <ScrollView>
      <Card containerStyle={{backgroundColor: '#FFDCDC'}}>
        <View style={{justifyContent: 'center'}}>
          <Avatar
            source={{uri: uploadsUrl + pet}}
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
            You adopted {JSON.stringify(fileTitle)} from{' '}
            {JSON.stringify(ownername)} successfully!
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon
            name="grin-hearts"
            type="font-awesome-5"
            color="red"
            containerStyle={{marginBottom: 15}}
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

import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {Avatar, Icon, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useFavorite} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert, TouchableOpacity} from 'react-native';
import {View} from 'react-native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  // console.log(props);
  const {deleteFile} = useMedia();
  const {likeAnImage, loadLikes, dislikeAnImage, removeRating} = useFavorite();
  const {setUpdate, update} = useContext(MainContext);
  const [like, setLike] = useState(0);

  const doLike = async () => {
    try {
      //if like is 5 then removeRating then setlike to 0
      setLike(5);
      if (like === 5) {
        Alert.alert('Message', 'You liked this pet!');
      }
      const userToken = await AsyncStorage.getItem('userToken');
      const favResponse = await likeAnImage(singleMedia.file_id, userToken);
      // console.log('posting user like', favResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const doDisLike = async () => {
    try {
      //if like is 5 then removeRating then setlike to 0
      setLike(1);
      if (like === 1) {
        Alert.alert('Message', 'You disliked this pet!');
      }
      const userToken = await AsyncStorage.getItem('userToken');
      const unfavResponse = await dislikeAnImage(
        singleMedia.file_id,
        userToken
      );
      //console.log('posting user dislike', unfavResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const loadlike = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const favResponse = await loadLikes(userToken);

      favResponse.forEach((item) => {
        //console.log('posting user like', item);
        if (item.file_id === singleMedia.file_id) {
          setLike(item.rating);
        }
      });
    } catch (error) {
      console.log('error');
    }
  };

  const loadDislike = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const favResponse = await loadDisLikes(userToken);

      favResponse.forEach((item) => {
        //console.log('posting user like', item);
        if (item.file_id === singleMedia.file_id) {
          setLike(3);
        }
      });
    } catch (error) {
      console.log('error');
    }
  };

  useEffect(() => {
    loadlike();
    loadDislike();
  }, []);

  const doDelete = () => {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteFile(singleMedia.file_id, userToken);
              setUpdate(update + 1);
            } catch (error) {
              // notify user here?
              console.error(error);
            }
          },
        },
      ],
      {cancelable: false}
    );
  };
  //console.log('valueOfLike : ', like);
  return (
    <RNEListItem
      containerStyle={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,

        elevation: 13,
      }}
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <View>
        <Avatar
          size="xlarge"
          rounded
          containerStyle={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.39,
            shadowRadius: 5.3,
            elevation: 13,
          }}
          source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
        ></Avatar>

        <View style={{flexDirection: 'row', alignContent: 'center'}}>
          <TouchableOpacity onPress={doLike}>
            <Icon
              raised
              name={'thumbs-up'}
              size={20}
              type="font-awesome-5"
              color={like === 5 ? 'red' : 'grey'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={doDisLike} style={{marginLeft: 40}}>
            <Icon
              raised
              name={'thumbs-down'}
              size={20}
              type="font-awesome-5"
              color={like === 1 ? 'red' : 'grey'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <RNEListItem.Content>
        <RNEListItem.Title h2 style={{alignSelf: 'center', color: '#1ABBD1'}}>
          {singleMedia.title}
        </RNEListItem.Title>

        <RNEListItem.Subtitle
          style={{
            alignSelf: 'center',
            fontSize: 16,
            marginTop: 10,
            color: 'gray',
          }}
        >
          {singleMedia.media_type}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle
          style={{
            alignSelf: 'center',
            fontSize: 16,
            marginTop: 10,
            fontWeight: 'bold',
          }}
        >
          {singleMedia.description}
        </RNEListItem.Subtitle>

        {isMyFile && (
          <>
            <View style={{flexDirection: 'row', marginTop: 100}}>
              <View style={{marginRight: 20}}>
                <Button
                  title="Modify"
                  onPress={() => navigation.push('Modify', {file: singleMedia})}
                  color="#1ABBD1"
                ></Button>
              </View>
              <View>
                <Button title="Delete" color="red" onPress={doDelete}></Button>
              </View>
            </View>
          </>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;

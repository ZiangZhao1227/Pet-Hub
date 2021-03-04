import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import {SearchBar} from 'react-native-elements';

const List = ({navigation, myFilesOnly}) => {
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(myFilesOnly, user.user_id);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  useEffect(() => {
    setFilteredDataSource(mediaArray);
  }, [mediaArray]);

  const searchFilterFunction = (text) => {
    // setMasterDataSource(mediaArray);
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = mediaArray.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        console.log('search filter result', itemData.indexOf(textData));

        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(mediaArray);
      setSearch(text);
    }
  };

  console.log('search master data source', filteredDataSource);
  // console.log('search media array', mediaArray);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <SearchBar
          round
          searchIcon={{size: 24,color:"#1ABBD1"}}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={() => searchFilterFunction('')}
          placeholder="Find your favorite pet"
          value={search}
          showLoading
          lightTheme
        />

        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem
              navigation={navigation}
              singleMedia={item}
              isMyFile={item.user_id === user.user_id}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;

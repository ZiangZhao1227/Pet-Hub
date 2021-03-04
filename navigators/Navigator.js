import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Picture from '../views/Picture';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from 'react-native-elements';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{backgroundColor: 'pink'}}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Pet List':
              iconName = 'paw';
              break;
            case 'Profile':
              iconName = 'user-circle';
              break;
            case 'Upload':
              iconName = 'arrow-circle-up';
              break;
          }
          return (
            <Icon
              type="font-awesome"
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#1ABBD1',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'pink', //color you want to change
        },
      }}
    >
      <Tab.Screen name="Pet List" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Upload" component={Upload} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabScreen}
            options={({route}) => ({
              headerTitle: getFocusedRouteNameFromRoute(route),
              headerTintColor: '#fff',
              headerStyle: {
                backgroundColor: 'pink',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
            })}
          />
          <Stack.Screen
            name="Modify"
            component={Modify}
            options={{
              title: 'Pet info',
              headerStyle: {
                backgroundColor: 'pink',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="My Files"
            component={MyFiles}
            options={{
              title: 'Pet info',
              headerStyle: {
                backgroundColor: 'pink',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              title: 'Pet info',
              headerStyle: {
                backgroundColor: 'pink',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="Picture"
            component={Picture}
            options={{
              title: 'Pet info',
              headerStyle: {
                backgroundColor: 'pink',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTintColor: '#fff',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;

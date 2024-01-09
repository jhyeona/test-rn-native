import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../../container/SignIn';
import DrawerNavigation from '../DrawerNavigation';

const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator();

const RootStackNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="SignIn">
        <Drawer.Screen
          name="SignIn"
          component={SignIn}
          options={{drawerLabel: () => null, headerShown: false}}
        />
        <RootStack.Screen
          name="Root"
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;

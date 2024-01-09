import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from './SignIn';
import Schedule from './schedule';

const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator();

const RootDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Schedule" component={Schedule} />
    </Drawer.Navigator>
  );
};

function App(): React.JSX.Element {
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
          component={RootDrawer}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;

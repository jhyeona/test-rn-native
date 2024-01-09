import React from 'react';
import Schedule from '../../container/schedule';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Schedule" component={Schedule} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

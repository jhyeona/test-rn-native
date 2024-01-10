import React from 'react';
import Schedule from '../../containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Schedule" component={Schedule} />
    </Tab.Navigator>
  );
};

export default TabNavigation;

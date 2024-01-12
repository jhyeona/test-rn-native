import React from 'react';
import Schedule from '../../containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '../../containers/Mypage';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Mypage" component={Mypage} />
    </Tab.Navigator>
  );
};

export default TabNavigation;

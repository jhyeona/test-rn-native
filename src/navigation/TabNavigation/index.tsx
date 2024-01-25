import React from 'react';
import Schedule from '../../containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '../../containers/Mypage';
import SvgIcon from '../../components/common/Icon/Icon.tsx';
import SignIn from '../../containers/SignIn';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          //props: focused, size
          if (route.name === 'Schedule') {
            return <SvgIcon name="Home" size={23} color={color} />;
          }
          if (route.name === 'Mypage') {
            return <SvgIcon name="Setting" size={29} color={color} />;
          }
        },
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

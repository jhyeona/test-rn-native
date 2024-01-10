import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const test = () => {
    navigation.navigate('SignIn');
  };
  return (
    <SafeAreaView>
      <Text>Schedule</Text>
      <TouchableOpacity onPress={test}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Schedule;

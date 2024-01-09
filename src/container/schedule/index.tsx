import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useRecoilValue} from 'recoil';
import testState from '../../recoil/Schedule';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const testData = useRecoilValue(testState.testTestState);
  const test = () => {
    navigation.navigate('SignIn');
  };
  return (
    <SafeAreaView>
      <Text>Schedule</Text>
      <Text>RecoilTestText: {testData.text}</Text>
      <TouchableOpacity onPress={test}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Schedule;

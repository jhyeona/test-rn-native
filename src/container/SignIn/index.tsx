import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
const SignIn = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const test = () => {
    navigation.navigate('Root');
  };
  return (
    <SafeAreaView>
      <Text>SignIn</Text>
      <TouchableOpacity onPress={test}>
        <Text>LOGIN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignIn;

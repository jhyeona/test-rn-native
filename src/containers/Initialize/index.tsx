import React from 'react';
import {Image, View} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const Initialize = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        style={{width: 100, height: 100}}
        source={require('../../assets/logo.png')}
      />
    </View>
  );
};

export default Initialize;

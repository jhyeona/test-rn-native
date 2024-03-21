import React, {useEffect} from 'react';
import {Image, View} from 'react-native';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {onesignalInit} from '#utils/onesignalHelper.ts';
// import {storage} from '#utils/storageHelper.ts';

const Initialize = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  useEffect(() => {
    onesignalInit();
    // const isVisitor = storage.getBoolean('isVisitor');
    // if (!isVisitor) {
    //   navigation.navigate('Onboarding');
    //   return;
    // }
    navigation.navigate('SignIn');
  }, [navigation]);

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

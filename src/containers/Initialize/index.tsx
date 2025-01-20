import React, {useEffect} from 'react';
import {View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useQueryClient} from '@tanstack/react-query';
import {useRecoilValue} from 'recoil';

import GlobalState from '#recoil/Global';

const Initialize = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const queryClient = useQueryClient();
  const isLogin = useRecoilValue(GlobalState.isLoginState);

  useEffect(() => {
    if (!isLogin) {
      queryClient.clear();
      navigation.navigate('SignIn');
    }
  }, [isLogin]);

  useEffect(() => {
    // const isVisitor = storage.getBoolean('isVisitor');
    // if (!isVisitor) {
    //   navigation.navigate('Onboarding');
    //   return;
    // }
    // navigation.navigate('SignIn');
  }, [navigation]);

  return <View />;
};

export default Initialize;

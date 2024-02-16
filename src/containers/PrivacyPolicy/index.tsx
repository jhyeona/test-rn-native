import React from 'react';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

const PrivacyPolicy = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  return (
    <CSafeAreaView>
      <Header title="개인정보처리방침" isBack navigation={navigation} />
    </CSafeAreaView>
  );
};

export default PrivacyPolicy;

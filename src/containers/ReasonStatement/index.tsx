import React from 'react';
import {Text} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Header from '#components/common/Header/Header.tsx';

const ReasonStatement = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  return (
    <CSafeAreaView>
      <Header title="사유서" isBack navigation={navigation} />
      <CView>
        <Text>dd</Text>
      </CView>
    </CSafeAreaView>
  );
};

export default ReasonStatement;

import React from 'react';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Header from '#components/common/Header/Header.tsx';
import ReasonTable from '#containers/ReasonStatement/components/ReasonTable.tsx';

export interface NavigateReasonProps {
  isCreate: boolean;
  reasonId?: string;
}

const ReasonStatement = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const navigateReasonCreator = ({isCreate, reasonId}: NavigateReasonProps) => {
    navigation.navigate('ReasonCreator', {isCreate, reasonId});
  };

  return (
    <CSafeAreaView>
      <Header title="사유서 목록" isBack navigation={navigation} />
      <CView>
        <ReasonTable handleNavigate={navigateReasonCreator} />
        <CButton
          text="사유서 작성하기"
          onPress={() => navigateReasonCreator({isCreate: true})}
        />
      </CView>
    </CSafeAreaView>
  );
};

export default ReasonStatement;

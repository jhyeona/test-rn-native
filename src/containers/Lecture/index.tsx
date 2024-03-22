import React from 'react';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';

interface Props {
  navigation: BottomTabNavigationHelpers;
}

const Lecture = (props: Props) => {
  const {navigation} = props;

  return (
    <CSafeAreaView>
      <Header title="강의" isBack navigation={navigation} />
      <CView>
        <CText text="강의 선택~" />
      </CView>
    </CSafeAreaView>
  );
};
export default Lecture;

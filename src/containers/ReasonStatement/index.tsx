import React from 'react';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown';
import Header from '#components/common/Header/Header.tsx';
import NoData from '#components/common/NoData';
import ReasonTable from '#containers/ReasonStatement/components/ReasonTable.tsx';

const ReasonStatement = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const items: ItemProps[] = [{id: '전체보기', label: '전체보기'}];
  const changedLecture = (item: ItemProps) => {
    //
  };

  return (
    <CSafeAreaView>
      <Header title="사유서 목록" isBack navigation={navigation} />
      <CView>
        <Dropdown items={items} onSelect={changedLecture} selected={items[0]} />
        <ReasonTable />
        <CButton
          text="사유서 작성하기"
          onPress={() => {
            navigation.navigate('ReasonCreator');
          }}
        />
      </CView>
    </CSafeAreaView>
  );
};

export default ReasonStatement;

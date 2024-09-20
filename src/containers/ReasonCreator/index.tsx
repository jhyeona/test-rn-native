import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import moment from 'moment';

import DatePicker from '#components/common/Calendar/DatePickerProps.tsx';
import DateSelector from '#components/common/Calendar/DateSelector.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import Header from '#components/common/Header/Header.tsx';
import StatusInfoContainer from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';
import PhotoBox from '#containers/ReasonCreator/components/PhotoBox.tsx';

const ReasonCreator = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const items: ItemProps[] = [{id: '전체보기', label: '전체보기'}];
  const changedLecture = (item: ItemProps) => {
    //
  };

  const handleCreate = () => {
    // navigation.navigate('CreateReason');
  };

  return (
    <CSafeAreaView>
      <Header title="사유서 작성" isBack navigation={navigation} />
      <CView>
        <Dropdown items={items} onSelect={changedLecture} selected={items[0]} />
        <View style={styles.info}>
          <DatePicker />
          <View style={styles.status}>
            <CText text="상태 " />
            <StatusInfoContainer colorType="gray" text="미승인" />
          </View>
          <View style={styles.textContainer}>
            <textarea placeholder="사유서 내용을 입력해주세요." />
          </View>
        </View>
        <View>
          <CText text="사진" />
          <CText text={`(0/3)`} />
          <PhotoBox isDefault />
        </View>
        <CButton text="저장하기" onPress={handleCreate} />
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
  },
  textContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 7,
  },
});

export default ReasonCreator;

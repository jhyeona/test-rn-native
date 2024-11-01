import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
import {COLORS} from '#constants/colors.ts';

const SelectAcademy = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const onPressAddAcademy = () => {
    navigation.navigate('Academy');
  };

  return (
    <CSafeAreaView>
      <Header title="기관 설정" isBack navigation={navigation} />
      <CView style={styles.container}>
        <View style={{gap: 30}}>
          <CText text="일정을 확인할 기관을 선택해 주세요." />
          <AcademySelector />
        </View>
        <TouchableOpacity onPress={onPressAddAcademy}>
          <CText
            text="초대받은 기관 추가하기"
            color={COLORS.primary}
            fontWeight="600"
            style={styles.addAcademy}
          />
        </TouchableOpacity>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  addAcademy: {
    marginBottom: 50,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SelectAcademy;

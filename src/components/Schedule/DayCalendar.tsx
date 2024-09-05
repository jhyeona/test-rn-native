import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import WeeklyCalendar from '#components/Schedule/WeeklyCalendar.tsx';
import {COLORS} from '#constants/colors.ts';

interface DayCalendarProps {
  navigation: BottomTabNavigationHelpers;
}

const DayCalendar = ({navigation}: DayCalendarProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    //TODO: 일정 Pull to Refresh 기능 추가 (함수로 뽑아서 일간/주간에서 동일하게 사용할 수 있을지)
    setRefreshing(true);
    // 데이터를 새로 고침하는 로직을 여기에 추가
    setTimeout(() => {
      setRefreshing(false); // 새로 고침 완료 후 로딩 상태 해제
    }, 2000);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <WeeklyCalendar />
        <CButton
          text="사유서"
          noMargin
          onPress={() => {
            navigation.navigate('ReasonStatement');
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
  },
  headerCellInner: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  selectedHeaderCell: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
});

export default DayCalendar;

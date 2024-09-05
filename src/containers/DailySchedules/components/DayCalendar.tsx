import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import WeeklyCalendar from '#components/Schedule/WeeklyCalendar.tsx';
import {COLORS} from '#constants/colors.ts';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';

interface DayCalendarProps {
  navigation: BottomTabNavigationHelpers;
}

const DayCalendar = ({navigation}: DayCalendarProps) => {
  return (
    <View style={styles.container}>
      <WeeklyCalendar />
      <DaySchedules />
      <CButton
        text="사유서"
        noMargin
        onPress={() => {
          navigation.navigate('ReasonStatement');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
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

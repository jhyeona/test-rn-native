import React, {useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import moment from 'moment';
import {useRecoilValue} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import {REQ_DATE_FORMAT} from '#constants/common.ts';
import HistoryList from '#containers/ScheduleHistory/components/HistoryList.tsx';
import {useGetHistory} from '#containers/ScheduleHistory/hooks/useApi.ts';
import GlobalState from '#recoil/Global';

const ScheduleHistory = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const selectedAcademy = useRecoilValue(GlobalState.selectedAcademy);

  const [selectedDate, setSelectedDate] = useState(moment());

  const {
    getHistory: historyData,
    refetchHistory,
    isLoading,
  } = useGetHistory({
    academyId: selectedAcademy,
    startDate: selectedDate.format(REQ_DATE_FORMAT),
    endDate: selectedDate.format(REQ_DATE_FORMAT),
  });

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header title="출석 기록" navigation={navigation} />
      <CView>
        <ScrollView
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetchHistory} />}>
          <View style={styles.top}>
            <DatePicker handleDateSelection={setSelectedDate} />
            <View style={{alignItems: 'flex-end'}}>
              <CText color={COLORS.placeholder} text="P: 강의 출석 완료" />
              <CText color={COLORS.placeholder} text="N/P: 지각, 결석 및 미퇴실" />
            </View>
          </View>
          <HistoryList historyData={historyData} />
        </ScrollView>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default ScheduleHistory;

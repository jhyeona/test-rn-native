import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import moment from 'moment';
import {useRecoilValue} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePickerProps.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import {useGetLectureList} from '#containers/DailySchedules/hooks/useApi.ts';
import RefreshHistory from '#containers/ScheduleHistory/components/RefreshHistory.tsx';
import {useGetHistory} from '#containers/ScheduleHistory/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {EventProps} from '#types/schedule.ts';

const ScheduleHistory = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const selectedAcademy = useRecoilValue(GlobalState.selectedAcademy);

  const [selectedDate, setSelectedDate] = useState(moment());

  const {getHistory, refetchHistory} = useGetHistory({
    academyId: selectedAcademy,
    startDate: selectedDate.format('YYYYMMDD'),
    endDate: selectedDate.format('YYYYMMDD'),
  });

  const eventStatus = (eventList: Array<EventProps>) => {
    const entered = eventList.filter(val => {
      // 입실 내역
      return val.eventType === 'ENTER';
    })?.[0];
    const completed = eventList.filter(val => {
      // 퇴실 내역
      return val.eventType === 'COMPLETE';
    })?.[0];

    // 상태 (출석 인정시간 내 출석 + 퇴실 = P 아니면 N/P)
    const statusType = entered?.status === 'NORMAL' && completed ? 'P' : 'N/P';
    const statusColor = statusType === 'P' ? 'black' : 'red';

    const enteredTime = // 입실 시간
      entered ? `${moment(entered?.eventTime).format('HH : mm')}` : '-';
    const completedTime = // 퇴실 시간
      completed ? `${moment(completed?.eventTime).format('HH : mm')}` : '-';

    return {statusType, statusColor, enteredTime, completedTime};
  };

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header
        title="출석 기록"
        navigation={navigation}
        rightChildren={<RefreshHistory handleRefresh={refetchHistory} />}
      />
      <CView>
        <View style={styles.top}>
          <DatePicker handleChangeDate={setSelectedDate} />
          <View style={{alignItems: 'flex-end'}}>
            <CText color={COLORS.placeholder} text="P: 강의 출석 완료" />
            <CText
              color={COLORS.placeholder}
              text="N/P: 지각, 결석 및 미퇴실"
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.table}>
            <View style={[styles.row, styles.tableHeader]}>
              <View style={[styles.cell, styles.firstCell]}>
                <CText text="강의명" fontWeight="600" fontSize={15} />
              </View>
              <View style={styles.cell}>
                <CText text="상태" fontWeight="600" fontSize={15} />
              </View>
              <View style={[styles.cell]}>
                <CText text="입실" fontWeight="600" fontSize={15} />
              </View>
              <View style={styles.cell}>
                <CText text="퇴실" fontWeight="600" fontSize={15} />
              </View>
            </View>
            {getHistory?.historyList.length ? (
              getHistory.historyList.map((history, i) => {
                const scheduleEndTime = history.schedule.scheduleEndTime;
                const isBeforeEnd = moment().isBefore(moment(scheduleEndTime));
                const {statusType, statusColor, enteredTime, completedTime} =
                  eventStatus(history.eventList);
                return (
                  <View style={[styles.row, styles.borderTop]} key={i}>
                    <View style={[styles.cell, styles.firstCell]}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        lineBreakStrategyIOS="hangul-word">
                        {history.schedule.lecture.lectureName}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <CText
                        color={isBeforeEnd ? 'black' : statusColor}
                        text={isBeforeEnd ? '-' : statusType}
                      />
                    </View>
                    <View style={styles.cell}>
                      <CText
                        style={{textAlign: 'center'}}
                        text={enteredTime}
                        lineBreak
                      />
                    </View>
                    <View style={styles.cell}>
                      <CText
                        style={{textAlign: 'center', paddingHorizontal: 5}}
                        text={completedTime}
                        lineBreak
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={[styles.row, styles.noData]}>
                <CText text="기록이 없습니다." />
              </View>
            )}
          </View>
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
  table: {
    flexDirection: 'column',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.layout,
  },
  tableHeader: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: COLORS.lightGray,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstCell: {
    flex: 1.5,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.layout,
  },
});

export default ScheduleHistory;

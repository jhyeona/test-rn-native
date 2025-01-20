import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import moment from 'moment/moment';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {eventStatus} from '#containers/ScheduleHistory/utils/dataHelper.ts';
import {ResSchedulePeriodDataProps} from '#types/schedule.ts';

interface HistoryListProps {
  historyData?: ResSchedulePeriodDataProps;
}

const HistoryList = ({historyData}: HistoryListProps) => {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.tableHeader]}>
        <View style={[styles.cell, styles.firstCell]}>
          <CText text="강의명" fontWeight="600" fontSize={15} />
        </View>
        <View style={styles.cell}>
          <CText text="상태" fontWeight="600" fontSize={15} />
        </View>
        <View style={[styles.cell]}>
          <CText text="출석" fontWeight="600" fontSize={15} />
        </View>
        <View style={styles.cell}>
          <CText text="퇴실" fontWeight="600" fontSize={15} />
        </View>
      </View>
      {historyData?.historyList.length ? (
        historyData.historyList.map((history, i) => {
          const scheduleEndTime = history.schedule.scheduleEndTime;
          const isBeforeEnd = moment().isBefore(moment(scheduleEndTime));
          const {statusType, statusColor, enteredTime, completedTime} = eventStatus(
            history.eventList,
          );
          return (
            <View style={[styles.row, styles.borderTop]} key={i}>
              <View style={[styles.cell, styles.firstCell]}>
                <Text numberOfLines={2} ellipsizeMode="tail" lineBreakStrategyIOS="hangul-word">
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
                <CText style={{textAlign: 'center'}} text={enteredTime} lineBreak />
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
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  tableHeader: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: COLORS.primaryLight,
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
    borderTopColor: COLORS.lineBlue,
  },
});

export default HistoryList;

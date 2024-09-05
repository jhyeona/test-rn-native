import React from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import moment from 'moment';
import {useRecoilValue} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import DayScheduleHistory from '#components/Schedule/DayScheduleHistory.tsx';
import {COLORS} from '#constants/colors.ts';
import {useGetDaySchedule} from '#hooks/useSchedule.ts';
import globalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {StudentInfoProps} from '#types/user.ts';
import {isBetween} from '#utils/scheduleHelper.ts';

interface Props {
  navigation: BottomTabNavigationHelpers;
  studentInfo: StudentInfoProps;
}

const DayScheduleTable = (props: Props) => {
  const {navigation, studentInfo} = props;
  const selectedAcademy = useRecoilValue(globalState.selectedAcademy);
  const {dayScheduleData} = useGetDaySchedule({
    academyId: selectedAcademy,
    date: moment().format('YYYY-MM-DD'),
  });
  const onPressHandlePage = (page: string, scheduleId: number) => {
    navigation.navigate(page, {
      attendeeId: studentInfo.attendeeId,
      scheduleId: scheduleId,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      style={[
        styles.container,
        {flexGrow: dayScheduleData?.scheduleList.length === 0 ? 1 : 0},
      ]}>
      <View style={styles.table}>
        <View
          style={[
            styles.row,
            {borderBottomWidth: 1, borderColor: COLORS.lineBlue},
          ]}>
          <View
            style={[
              styles.cell,
              {
                flex: 0.3,
                borderRightWidth: 1,
                borderColor: COLORS.lineBlue,
                paddingVertical: 5,
              },
            ]}>
            <CText
              text="시간"
              fontWeight="800"
              fontSize={16}
              color={COLORS.primary}
              style={styles.headerText}
            />
          </View>
          <View style={[styles.cell, {paddingVertical: 5}]}>
            <CText
              text="예정강의"
              fontWeight="800"
              fontSize={16}
              style={styles.headerText}
              color={COLORS.primary}
            />
          </View>
        </View>
        {dayScheduleData && dayScheduleData.scheduleList.length > 0 ? (
          dayScheduleData.scheduleList.map(schedule => {
            const payload = {
              attendeeId: studentInfo.attendeeId,
              scheduleId: schedule.scheduleId,
            };
            return (
              <View key={schedule.scheduleId} style={styles.row}>
                <View
                  style={[
                    styles.cell,
                    {
                      flex: 0.3,
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderRightWidth: 1,
                      borderColor: COLORS.lineBlue,
                    },
                  ]}>
                  <CText
                    fontWeight="700"
                    style={styles.timeText}
                    text={`${moment(schedule.scheduleStartTime).format(
                      'HH:mm',
                    )}\n~\n${moment(schedule.scheduleEndTime).format('HH:mm')}`}
                  />
                  {isBetween(
                    moment(schedule.scheduleStartTime).subtract(
                      schedule.lecture.lectureAllowMinus,
                      'minutes',
                    ),
                    moment(schedule.scheduleEndTime).add(
                      schedule.scheduleEndTime,
                      'minutes',
                    ),
                  ) && (
                    <View style={{marginTop: 15}}>
                      <SvgIcon name="ScheduleTimeLIne" />
                    </View>
                  )}
                </View>
                <View style={styles.cell}>
                  <View style={styles.lectureBox}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <CText
                        text={schedule.lecture.lectureName}
                        fontSize={15}
                        fontWeight="600"
                        style={{flexShrink: 1}}
                      />
                      <Pressable
                        onPress={() =>
                          onPressHandlePage(
                            'LectureDetail',
                            schedule.scheduleId,
                          )
                        }>
                        <SvgIcon name="Pencil" width={20} />
                      </Pressable>
                    </View>
                    <CText
                      text={`${moment(schedule.lecture.lectureStartDate).format(
                        'YYYY.MM.DD',
                      )} ~ ${moment(schedule.lecture.lectureEndDate).format(
                        'YYYY.MM.DD',
                      )}`}
                    />
                    <DayScheduleHistory
                      schedule={schedule}
                      scheduleHistoryPayload={payload}
                    />
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noData}>
            <CText text="강의가 없습니다." fontSize={20} color={COLORS.gray} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexGrow: 0,
    marginVertical: 16,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderRadius: 7,
  },
  headerText: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  timeText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: 'black',
  },
  lectureBox: {
    flex: 1,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 7,
  },
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  noData: {
    marginTop: 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default DayScheduleTable;

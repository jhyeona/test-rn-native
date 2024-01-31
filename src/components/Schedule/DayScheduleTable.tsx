import React from 'react';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import scheduleState from '../../recoil/Schedule';
import CText from '../common/CustomText/CText.tsx';
import {COLORS} from '../../constants/colors.ts';
import SvgIcon from '../common/Icon/Icon.tsx';
import moment from 'moment';

import {StudentInfoProps} from '../../types/user.ts';
import DayScheduleHistory from './DayScheduleHistory.tsx';

interface Props {
  navigation: BottomTabNavigationHelpers;
  studentInfo: StudentInfoProps;
}

const DayScheduleTable = (props: Props) => {
  const {navigation, studentInfo} = props;
  const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);

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
      style={styles.container}>
      <View style={styles.table}>
        <View
          style={[
            styles.row,
            {borderBottomWidth: 1, borderColor: COLORS.lineBlue},
          ]}>
          <View
            style={[
              styles.cell,
              {flex: 0.3, borderRightWidth: 1, borderColor: COLORS.lineBlue},
            ]}>
            <Text style={styles.headerText}>시간</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.headerText}>예정 강의</Text>
          </View>
        </View>
        {dayScheduleData?.scheduleList.map(schedule => {
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
                    alignItems: 'flex-start',
                    paddingVertical: 10,
                    borderRightWidth: 1,
                    borderColor: COLORS.lineBlue,
                  },
                ]}>
                <Text style={styles.timeText}>
                  {moment(schedule.scheduleStartTime).format('HH:mm')}
                  {`\n~\n`}
                  {moment(schedule.scheduleEndTime).format('HH:mm')}
                </Text>
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
                    />
                    <Pressable
                      onPress={() =>
                        onPressHandlePage('LectureDetail', schedule.scheduleId)
                      }>
                      <SvgIcon name="Pencil" width={20} />
                    </Pressable>
                  </View>
                  <Text style={{color: 'black'}}>
                    {moment(schedule.lecture.lectureStartDate).format(
                      'YYYY.MM.DD',
                    )}
                    ~
                    {moment(schedule.lecture.lectureEndDate).format(
                      'YYYY.MM.DD',
                    )}
                  </Text>
                  <DayScheduleHistory schedule={schedule} payload={payload} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderRadius: 7,
  },
  headerText: {
    paddingVertical: 10,
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
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
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default DayScheduleTable;

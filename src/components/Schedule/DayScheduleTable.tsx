import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  DayScheduleDetailProps,
  DayScheduleProps,
} from '../../types/schedule.ts';
import moment from 'moment';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StudentInfoProps} from '../../types/user.ts';
import DayScheduleList from './DayScheduleList.tsx';

interface Props {
  headers: Array<String>;
  scheduleData: DayScheduleProps;
  navigation: BottomTabNavigationHelpers;
  studentInfo: StudentInfoProps;
}

const DayScheduleTable = (props: Props) => {
  const {headers, scheduleData, studentInfo, navigation} = props;
  const [scheduleTime, setScheduleTime] = useState(
    moment().format('YYYY-MM-DD HH:ss'),
  );

  const isBetweenTime = (startTime: string, endTime: string) => {
    return moment().isBetween(startTime, endTime, undefined, '[]');
  };

  const timeSet = useCallback((value: DayScheduleDetailProps) => {
    // 강의 시간 관리
    const startTime = moment(value.scheduleStartTime).format(
      'YYYY-MM-DD HH:mm',
    );
    const allowStartTime = moment(value.scheduleStartTime)
      .subtract(value.lecture.lectureAllowMinus, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    const endTime = moment(startTime)
      .add(value.scheduleMinutes, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    const isNow = isBetweenTime(allowStartTime, endTime); // 현재 강의
    const isBefore = moment(endTime).isBefore(moment()) && !isNow; // 지난 강의
    const isAfter = moment(startTime).isAfter(moment()) && !isNow; // 예정 강의
    return {startTime, allowStartTime, endTime, isBefore, isNow, isAfter};
  }, []);

  const onPressLectureDetail = () => {
    navigation.navigate('LectureDetail');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      scheduleData.scheduleList.map(value => {
        const {allowStartTime, endTime} = timeSet(value);
        if (
          moment().format('YYYY-MM-DD HH:mm') === allowStartTime ||
          moment().format('YYYY-MM-DD HH:mm') === endTime
        ) {
          // 현재 시간이 시작시간 또는 종료시간일 때 값을 지정하여 리렌더링 되도록
          setScheduleTime(allowStartTime);
          return;
        }
      });
    }, 1000); // 1초
    return () => clearInterval(intervalId);
  }, [scheduleData.scheduleList, timeSet]);
  const testItemList = useMemo(() => {
    return scheduleData.scheduleList.map(
      (value: DayScheduleDetailProps, index: number) => {
        const {startTime, endTime, isBefore, isNow, isAfter} = timeSet(value);

        const classArray = [];
        if (!value.scheduleParentId && value.scheduleChildId) {
          // 묶인 강의 중 첫번째 : 부모 스케쥴이 없고 하위스케쥴이 있음
          const nthClass = Math.floor(
            // value.lecture.lectureCheckInterval 이 있을 경우
            value.scheduleMinutes / value.lecture.lectureCheckInterval,
          );

          for (let i = 0; i <= nthClass; i++) {
            classArray.push(
              <Text style={{borderWidth: 1, borderRadius: 5, padding: 10}}>
                {i}교시: {value.scheduleStartTime} ~{' '}
                {moment(value.scheduleStartTime)
                  .add(value.lecture.lectureCheckInterval, 'minutes')
                  .format('HH:mm')}
              </Text>,
            );
          }
        }
        if (value.scheduleParentId && value.scheduleChildId) {
          // 묶인 강의 중 가운데 : 부모 스케쥴이 있고 하위 스케쥴도 있음
        }
        if (value.scheduleParentId && !value.scheduleChildId) {
          // 묶인 강의 중 마지막 : 부모 스케쥴이 있고 하위 스케쥴이 없음
        }
        return (
          <View key={index} style={[styles.row, styles.borderStyle]}>
            <View style={[styles.rowItem]}>
              <Text>
                {moment(startTime).format('HH:mm')} ~{' '}
                {moment(endTime).format('HH:mm')}
              </Text>
            </View>
            <View style={{flexGrow: 1, padding: 5}}>
              <View
                style={{
                  flexGrow: 1,
                  padding: 10,
                  backgroundColor: 'lightgrey',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexGrow: 1,
                      marginRight: 5,
                    }}>
                    <Text>{value.lecture.lectureName}</Text>
                    <Text>
                      {value.lecture.lectureStartDate} ~{' '}
                      {value.lecture.lectureEndDate}
                    </Text>
                  </View>
                  <Pressable onPress={onPressLectureDetail}>
                    <Text>↔️</Text>
                  </Pressable>
                </View>
                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                  {value.lecture.lecturePlaceName && (
                    <View style={styles.row}>
                      <Text>[지도아이콘] </Text>
                      <Text>{value.lecture.lecturePlaceName}</Text>
                    </View>
                  )}
                </View>
                {isBefore && (
                  <DayScheduleList
                    isBefore
                    testList={classArray}
                    scheduleId={value.scheduleId}
                    studentInfo={studentInfo}
                  />
                )}
                {isAfter && (
                  <DayScheduleList
                    isAfter
                    testList={classArray}
                    scheduleId={value.scheduleId}
                    studentInfo={studentInfo}
                  />
                )}
                {isNow && (
                  <DayScheduleList
                    isNow
                    testList={classArray}
                    scheduleId={value.scheduleId}
                    studentInfo={studentInfo}
                  />
                )}
              </View>
            </View>
          </View>
        );
      },
    );
  }, [scheduleData.scheduleList]);
  console.log('testItemList: ', testItemList);

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.borderStyle, {backgroundColor: 'grey'}]}>
        {headers.map((header, index) => (
          <View
            key={index}
            style={[
              styles.rowItem,
              index < 1 ? {width: '30%'} : {flexGrow: 1},
            ]}>
            <Text style={[styles.rowItemText, {color: 'white'}]}>{header}</Text>
          </View>
        ))}
      </View>
      <ScrollView>
        {testItemList}
        {/*{scheduleTime &&*/}
        {/*  scheduleData.scheduleList.map(*/}
        {/*    (value: DayScheduleDetailProps, index: number) => {*/}
        {/*      const {startTime, endTime, isBefore, isNow, isAfter} =*/}
        {/*        timeSet(value);*/}

        {/*      const classArray = [];*/}
        {/*      if (!value.scheduleParentId && value.scheduleChildId) {*/}
        {/*        // 묶인 강의 중 첫번째 : 부모 스케쥴이 없고 하위스케쥴이 있음*/}
        {/*        const nthClass = Math.floor(*/}
        {/*          // value.lecture.lectureCheckInterval 이 있을 경우*/}
        {/*          value.scheduleMinutes / value.lecture.lectureCheckInterval,*/}
        {/*        );*/}

        {/*        for (let i = 0; i <= nthClass; i++) {*/}
        {/*          classArray.push(*/}
        {/*            <Text*/}
        {/*              style={{borderWidth: 1, borderRadius: 5, padding: 10}}>*/}
        {/*              {i}교시: {value.scheduleStartTime} ~{' '}*/}
        {/*              {moment(value.scheduleStartTime)*/}
        {/*                .add(value.lecture.lectureCheckInterval, 'minutes')*/}
        {/*                .format('HH:mm')}*/}
        {/*            </Text>,*/}
        {/*          );*/}
        {/*        }*/}
        {/*      }*/}
        {/*      if (value.scheduleParentId && value.scheduleChildId) {*/}
        {/*        // 묶인 강의 중 가운데 : 부모 스케쥴이 있고 하위 스케쥴도 있음*/}
        {/*      }*/}
        {/*      if (value.scheduleParentId && !value.scheduleChildId) {*/}
        {/*        // 묶인 강의 중 마지막 : 부모 스케쥴이 있고 하위 스케쥴이 없음*/}
        {/*      }*/}
        {/*      return (*/}
        {/*        <View key={index} style={[styles.row, styles.borderStyle]}>*/}
        {/*          <View style={[styles.rowItem]}>*/}
        {/*            <Text>*/}
        {/*              {moment(startTime).format('HH:mm')} ~{' '}*/}
        {/*              {moment(endTime).format('HH:mm')}*/}
        {/*            </Text>*/}
        {/*          </View>*/}
        {/*          <View style={{flexGrow: 1, padding: 5}}>*/}
        {/*            <View*/}
        {/*              style={{*/}
        {/*                flexGrow: 1,*/}
        {/*                padding: 10,*/}
        {/*                backgroundColor: 'lightgrey',*/}
        {/*              }}>*/}
        {/*              <View*/}
        {/*                style={{*/}
        {/*                  flexDirection: 'row',*/}
        {/*                  justifyContent: 'space-between',*/}
        {/*                }}>*/}
        {/*                <View*/}
        {/*                  style={{*/}
        {/*                    flexGrow: 1,*/}
        {/*                    marginRight: 5,*/}
        {/*                  }}>*/}
        {/*                  <Text>{value.lecture.lectureName}</Text>*/}
        {/*                  <Text>*/}
        {/*                    {value.lecture.lectureStartDate} ~{' '}*/}
        {/*                    {value.lecture.lectureEndDate}*/}
        {/*                  </Text>*/}
        {/*                </View>*/}
        {/*                <Pressable onPress={onPressLectureDetail}>*/}
        {/*                  <Text>↔️</Text>*/}
        {/*                </Pressable>*/}
        {/*              </View>*/}
        {/*              <View*/}
        {/*                style={[styles.row, {justifyContent: 'space-between'}]}>*/}
        {/*                {value.lecture.lecturePlaceName && (*/}
        {/*                  <View style={styles.row}>*/}
        {/*                    <Text>[지도아이콘] </Text>*/}
        {/*                    <Text>{value.lecture.lecturePlaceName}</Text>*/}
        {/*                  </View>*/}
        {/*                )}*/}
        {/*              </View>*/}
        {/*              {isBefore && (*/}
        {/*                <DayScheduleList*/}
        {/*                  isBefore*/}
        {/*                  testList={classArray}*/}
        {/*                  scheduleId={value.scheduleId}*/}
        {/*                  studentInfo={studentInfo}*/}
        {/*                />*/}
        {/*              )}*/}
        {/*              {isAfter && (*/}
        {/*                <DayScheduleList*/}
        {/*                  isAfter*/}
        {/*                  testList={classArray}*/}
        {/*                  scheduleId={value.scheduleId}*/}
        {/*                  studentInfo={studentInfo}*/}
        {/*                />*/}
        {/*              )}*/}
        {/*              {isNow && (*/}
        {/*                <DayScheduleList*/}
        {/*                  isNow*/}
        {/*                  testList={classArray}*/}
        {/*                  scheduleId={value.scheduleId}*/}
        {/*                  studentInfo={studentInfo}*/}
        {/*                />*/}
        {/*              )}*/}
        {/*            </View>*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*      );*/}
        {/*    },*/}
        {/*  )}*/}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  table: {backgroundColor: 'white', flex: 1},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 50,
    width: '20%',
  },
  rowItemText: {textAlign: 'center'},
  borderStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  locationButton: {
    width: 34,
    height: 34,
  },
  button: {
    backgroundColor: 'grey',
    borderRadius: 5,
    borderWidth: 0.4,
    width: 100,
    alignItems: 'center',
    marginTop: 5,
  },
});
export default DayScheduleTable;

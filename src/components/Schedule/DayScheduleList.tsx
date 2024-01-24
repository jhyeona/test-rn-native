import React, {ReactNode, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  postEventComeback,
  postEventComplete,
  postEventEnter,
  postEventLeave,
  useGetScheduleHistory,
} from '../../hooks/useSchedule.ts';
import {EventProps, ScheduleProps} from '../../types/schedule.ts';
import {StudentInfoProps} from '../../types/user.ts';
import {ApiResponseProps} from '../../types/common.ts';

interface Props {
  scheduleId: number;
  studentInfo: StudentInfoProps;
  isBefore?: boolean;
  isAfter?: boolean;
  isNow?: boolean;
  testList: Array<ReactNode>;
}
const DayScheduleList = (props: Props) => {
  const {scheduleId, studentInfo, isBefore, isAfter, isNow, testList} = props;
  const [args, setArgs] = useState<EventProps>({
    attendeeId: studentInfo.attendeeId,
    scheduleId: scheduleId,
    latitude: 0.1,
    longitude: 0.1,
    altitude: 0.1,
    wifis: [],
    bles: [],
  });
  const [scheduleHistory, setScheduleHistory] = useState<
    ScheduleProps | undefined
  >(undefined);
  const [isEnter, setIsEnter] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLeave, setIsLeave] = useState(false);

  const historyData = useGetScheduleHistory({
    scheduleId: scheduleId,
    attendeeId: studentInfo?.attendeeId,
  });

  const onPressEnter = async (scheduleId: number) => {
    // 출석 체크
    setArgs({
      attendeeId: studentInfo.attendeeId,
      scheduleId: scheduleId,
      latitude: 0.1,
      longitude: 0.1,
      altitude: 0.1,
      wifis: [],
      bles: [],
    });

    try {
      const response = await postEventEnter(args);
      console.log('RESPONSE:', response);

      Alert.alert('입실 처리 되었습니다.');
    } catch (e: any) {
      if (e.code === '1004') {
        Alert.alert('이미 입실 처리 되었습니다.');
        return;
      }
      if (e.code === '1005') {
        Alert.alert('현재 진행중인 강의가 아닙니다.');
        return;
      }
      if (e.code === '4061') {
        Alert.alert('강의에 입력된 위치 인증 장치 정보에 부합하지 않습니다.');
        return;
      }
      console.log(e);
    }
  };

  const onPressComplete = async () => {
    // 퇴실
    try {
      const response = await postEventComplete(args);
      console.log('퇴실:', response);
      setIsComplete(true);
      Alert.alert('퇴실 처리 되었습니다.');
    } catch (e: any) {
      if (e.code === '1004') {
        Alert.alert('이미 퇴실 처리 되었습니다.');
        return;
      }
      if (e.code === '4061') {
        Alert.alert('강의에 입력된 위치 인증 장치 정보에 부합하지 않습니다.');
        return;
      }
      console.log(e);
    }
  };

  const onPressLeave = async () => {
    // 외출
    try {
      const response = await postEventLeave(args);
      console.log('외출:', response);
      setIsLeave(true);
      Alert.alert('외출이 시작되었습니다.');
    } catch (e) {
      console.log(e);
    }
  };

  const onPressComeback = async () => {
    // 복귀
    try {
      const response = await postEventComeback(args);
      console.log('컴백:', response);
      setIsLeave(false);
      Alert.alert('외출이 종료되었습니다.');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (scheduleHistory?.eventList.length === 0) {
      //아무 기록이 없을 때 => 출석 체크 버튼만 활성화
      setIsEnter(false);
      return;
    }
    if (scheduleHistory?.eventList[0].eventType === 'ENTER') {
      // 입실이 [0] 이라는 가정하에
      setIsEnter(true);
    }
  }, [scheduleHistory?.eventList]);

  useEffect(() => {
    setScheduleHistory(historyData);
  }, [historyData]);

  return (
    <View>
      {isBefore && (
        <Pressable style={styles.button} disabled>
          <Text>
            {scheduleHistory && scheduleHistory.eventList.length > 0
              ? '출석 완료'
              : '강의 종료'}
          </Text>
        </Pressable>
      )}
      {isAfter && (
        <Pressable style={styles.button} disabled>
          <Text>출석 예정</Text>
        </Pressable>
      )}
      {isNow && (
        <>
          {isEnter ? (
            <Pressable
              style={[styles.button, {width: '100%'}]}
              onPress={() => onPressComplete()}
              disabled={isComplete}>
              <Text>퇴실</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.button, {width: '100%'}]}
              onPress={() => onPressEnter(scheduleId)}
              disabled={isComplete}>
              <Text>출석체크</Text>
            </Pressable>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {isLeave ? (
              <Pressable
                style={styles.button}
                onPress={onPressComeback}
                disabled={isComplete}>
                <Text>외출 종료</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={onPressLeave}
                disabled={isComplete}>
                <Text>외출 시작</Text>
              </Pressable>
            )}
          </View>
          {testList.length > 0 && testList}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'grey',
    borderRadius: 5,
    borderWidth: 0.4,
    width: 100,
    alignItems: 'center',
    marginTop: 5,
  },
});
export default DayScheduleList;

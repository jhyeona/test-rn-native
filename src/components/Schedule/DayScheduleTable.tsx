import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {DayScheduleProps} from '../../types/schedule.ts';
import moment from 'moment';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StudentInfoProps} from '../../types/user.ts';

interface Props {
  headers: Array<String>;
  scheduleData: DayScheduleProps;
  navigation: BottomTabNavigationHelpers;
  studentInfo: StudentInfoProps;
}

const DayScheduleTable = (props: Props) => {
  const {headers, scheduleData, studentInfo, navigation} = props;
  const [isEnter, setIsEnter] = useState(false);

  const onSetTimeLine = (startTime: string, endTime: string) => {
    return moment().isBetween(startTime, endTime, undefined, '[]');
  };

  const onPressLectureDetail = () => {
    navigation.navigate('LectureDetail');
  };

  const onPressEnter = async (scheduleId: number) => {
    // 출석 체크
    const enterData = {
      //attendeeId: studentInfo.attendeeId,
      attendeeId: 1,
      scheduleId: scheduleId,
      latitude: 0.1,
      longitude: 0.1,
      altitude: 0.1,
      wifis: [
        {
          ssid: 'LFin-2G',
          bssid: '11:11:11:11:11:11',
          rssi: -72,
        },
        {
          ssid: 'LFin-5G',
          bssid: '11:11:11:11:11:11',
          rssi: -71,
        },
        {
          ssid: 'iptime',
          bssid: '11:11:11:11:11:11',
          rssi: -68,
        },
      ],
      bles: [
        {
          id: 'AAAA-AAAA-AAAA-AAAA',
          major: 10001,
          minor: 101,
        },
        {
          id: 'BBBB-AAAA-AAAA-AAAA',
          major: 10001,
          minor: 10,
        },
      ],
    };

    console.log('입실:', enterData);

    // try {
    //   await postEventEnter(data);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onPressComplete = async (scheduleId: number) => {
    const data = {};
    // try {
    //   await postEventComplete(data);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onPressLeave = async () => {
    const data = {};
    // try {
    //   await postEventLeave(data);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onPressComeback = async () => {
    const data = {};
    // try {
    //   await postEventComeback(data);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // useEffect(() => {
  //   // 매 분마다 실행
  //   const intervalId = setInterval(() => {
  //     const newMinute = moment().minute();
  //     console.log(newMinute);
  //   }, 60000); // 1분마다 갱신
  //
  //   // 컴포넌트가 언마운트되면 clearInterval을 통해 interval을 정리
  //   return () => clearInterval(intervalId);
  // }, []); // 빈 배열은 컴포넌트 마운트 시에만 실행

  return (
    <ScrollView style={styles.table}>
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
      {scheduleData.scheduleList.map((value, index) => (
        <View key={index} style={[styles.row, styles.borderStyle]}>
          <View style={[styles.rowItem, index < 2 && {width: '30%'}]}>
            <Text>
              {moment(value.scheduleStartTime).format('HH:mm')} ~{' '}
              {moment(value.scheduleStartTime)
                .add(value.scheduleMinutes, 'minutes')
                .format('HH:mm')}
            </Text>
            {onSetTimeLine(
              moment(value.scheduleStartTime).format('YYYY-MM-DD HH:mm'),
              moment(value.scheduleStartTime)
                .add(value.scheduleMinutes, 'minutes')
                .format('YYYY-MM-DD HH:mm'),
            ) && <Text> ---timeline--- </Text>}
          </View>
          <View style={{flexGrow: 1, padding: 5}}>
            <View
              style={{
                flexGrow: 1,
                padding: 10,
                backgroundColor: 'lightgrey',
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    flexGrow: 1,
                    marginRight: 5,
                  }}>
                  <Text>{value.lecture.lectureName}</Text>
                  <Text>강의 기간</Text>
                </View>
                <Pressable onPress={onPressLectureDetail}>
                  <Text>↔️</Text>
                </Pressable>
              </View>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <View style={styles.row}>
                  <Text>[지도아이콘] </Text>
                  <Text> 강의장소</Text>
                </View>
                <Pressable style={styles.button}>
                  <Text>출석 완료</Text>
                </Pressable>
              </View>
              {isEnter ? (
                <Pressable
                  style={[styles.button, {width: '100%'}]}
                  onPress={() => onPressComplete(value.scheduleId)}>
                  <Text>퇴실</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.button, {width: '100%'}]}
                  onPress={() => onPressEnter(value.scheduleId)}>
                  <Text>출석체크</Text>
                </Pressable>
              )}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Pressable style={styles.button} onPress={onPressLeave}>
                  <Text>외출 시작</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={onPressComeback}>
                  <Text>외출 종료</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  table: {backgroundColor: 'white'},
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

import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {DayScheduleProps} from '../../types/schedule.ts';
import moment from 'moment';

interface Props {
  headers: Array<String>;
  data: DayScheduleProps;
}

const DayScheduleTable = (props: Props) => {
  const {headers, data} = props;

  const onSetTimeLine = (startTime: string, endTime: string) => {
    // 2024-01-15 를 현재 시간으로 변경해서 처리
    return moment('2024-01-15 13:00').isBetween(
      startTime,
      endTime,
      undefined,
      '[]',
    );
  };
  // data.scheduleList.map((value, index) => {
  //   onSetTimeLine(
  //     moment(value.scheduleStartTime).format('YYYY-MM-DD HH:mm'),
  //     moment(value.scheduleStartTime)
  //       .add(value.scheduleMinutes, 'minutes')
  //       .format('YYYY-MM-DD HH:mm'),
  //   );
  // });
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
      {data.scheduleList.map((value, index) => (
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
                  <Text>{value.lectureName}</Text>
                  <Text>강의 기간</Text>
                </View>
                <Pressable>
                  <Text>↔️</Text>
                </Pressable>
              </View>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <View style={styles.row}>
                  <Text>[지도아이콘] </Text>
                  <Text> 강의장소</Text>
                </View>
                <Pressable
                  style={{
                    backgroundColor: 'grey',
                    borderRadius: 5,
                    borderWidth: 0.4,
                    width: 100,
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text>출석 완료</Text>
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
});
export default DayScheduleTable;

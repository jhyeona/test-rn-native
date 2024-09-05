import React, {useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import NoData from '#components/common/NoData';
import {COLORS} from '#constants/colors.ts';
import DayLecture from '#containers/DailySchedules/components/DayLecture.tsx';
import DayScheduleTime from '#containers/DailySchedules/components/DayScheduleTime.tsx';

interface Test {
  time: string;
  name: string;
}
const testData = [
  {time: '1', name: 'name1'},
  {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
  // {time: '2', name: 'name2'},
];
const firstCellWidth = 100;
const listHeader = () => {
  return (
    <View style={styles.header}>
      <View style={[styles.headerCell, styles.headerCellFirst]}>
        <CText
          style={styles.headerText}
          fontSize={16}
          color={COLORS.primary}
          text="시간"
        />
      </View>
      <View style={styles.headerCell}>
        <CText
          style={styles.headerText}
          fontSize={16}
          color={COLORS.primary}
          text="강의"
        />
      </View>
    </View>
  );
};

const DaySchedules = () => {
  const [data, _] = useState<Test[]>(testData);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    //TODO: 일정 Pull to Refresh 기능 추가 (함수로 뽑아서 일간/주간에서 동일하게 사용할 수 있을지)
    setRefreshing(true);
    // 데이터를 새로 고침하는 로직을 여기에 추가
    setTimeout(() => {
      setRefreshing(false); // 새로 고침 완료 후 로딩 상태 해제
    }, 2000);
  };

  const renderItem: ListRenderItem<Test> = ({item, index}) => {
    return (
      <View
        style={[
          styles.row,
          index === data.length - 1 ? {} : {borderBottomWidth: 1},
        ]}>
        <DayScheduleTime style={[styles.cell, styles.cellFirst]} />
        <View style={[styles.cell]}>
          <DayLecture />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.scheduleContent}
      ListHeaderComponent={listHeader}
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={<NoData />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 7,
  },
  scheduleContent: {
    borderRadius: 7,
    backgroundColor: COLORS.light.blue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: COLORS.lineBlue,
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  headerCellFirst: {
    flex: 0,
    width: firstCellWidth,
    borderRightWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  cellFirst: {
    flex: 0,
    width: firstCellWidth,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.lineBlue,
  },
});

export default DaySchedules;

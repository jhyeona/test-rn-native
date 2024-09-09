import React, {useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import moment from 'moment/moment';

import NoData from '#components/common/NoData';
import {FIRST_CELL_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';
import DaySchedulesHeader from '#containers/DailySchedules/components/DaySchedulesHeader.tsx';
import DaySchedulesLecture from '#containers/DailySchedules/components/DaySchedulesLecture.tsx';
import DaySchedulesTime from '#containers/DailySchedules/components/DaySchedulesTime.tsx';
import {useGetDaySchedule} from '#containers/DailySchedules/hooks';

interface Test {
  time: string;
  name: string;
}
const testData = [
  {time: '1', name: 'name1'},
  {time: '2', name: 'name2'},
];

const DaySchedules = () => {
  // const [{date: daily}, setSelectedDate] = useRecoilState(
  //   scheduleState.selectedCalendarDate,
  // );
  const [data, _] = useState<Test[]>(testData);
  const [refreshing, setRefreshing] = useState(false);

  // const selectedAcademy = useRecoilValue(globalState.selectedAcademy);
  const {dayScheduleData} = useGetDaySchedule({
    academyId: 1,
    date: moment('20240304').format('YYYYMMDD'),
  });
  //
  // useEffect(() => {
  //   console.log(dayScheduleData);
  // }, [dayScheduleData]);

  const onRefresh = () => {
    //TODO: 일정 Pull to Refresh 기능 추가 (함수로 뽑아서 일간/주간에서 동일하게 사용할 수 있을지)
    setRefreshing(true);
    // 데이터를 새로 고침하는 로직을 여기에 추가
    setTimeout(() => {
      setRefreshing(false); // 새로 고침 완료 후 로딩 상태 해제
    }, 1000);
  };

  const renderItem: ListRenderItem<Test> = ({item, index}) => {
    return (
      <View style={styles.row}>
        <DaySchedulesTime style={[styles.cell, styles.cellFirst]} />
        <View style={[styles.cell]}>
          <DaySchedulesLecture />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.scheduleContent,
        data.length === 0 && {flexGrow: 1},
      ]}
      ListHeaderComponent={<DaySchedulesHeader />}
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={<NoData fullHeight message="✏️ 강의가 없습니다." />}
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
    backgroundColor: COLORS.primaryLight,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 14,
  },
  cellFirst: {
    paddingHorizontal: 0,
    flex: 0,
    width: FIRST_CELL_WIDTH,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.lineBlue,
  },
});

export default DaySchedules;

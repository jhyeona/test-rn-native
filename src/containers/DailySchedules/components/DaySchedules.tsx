import {useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import {useRecoilValue} from 'recoil';

import NoData from '#components/common/NoData';
import {FIRST_CELL_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';
import DaySchedulesHeader from '#containers/DailySchedules/components/DaySchedulesHeader.tsx';
import DaySchedulesLecture from '#containers/DailySchedules/components/DaySchedulesLecture.tsx';
import DaySchedulesTime from '#containers/DailySchedules/components/DaySchedulesTime.tsx';
import {useGetDaySchedule} from '#containers/DailySchedules/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {ScheduleDefaultProps} from '#types/schedule.ts';

const DaySchedules = () => {
  const [isLoading, setIsLoading] = useState(false);
  const selectAcademy = useRecoilValue(GlobalState.selectedAcademy); // 선택된 기관
  const {date} = useRecoilValue(scheduleState.selectedCalendarDate); // 선택된 날짜
  // 스케쥴 데이터
  const {dayScheduleData, refetchDaySchedule} = useGetDaySchedule({
    academyId: selectAcademy,
    date: date.format('YYYYMMDD'),
  });

  // 당겨서 새로고침
  const onRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      refetchDaySchedule().then(() => {
        setIsLoading(false);
      });
    }, 50);
  };

  // 시간/강의 컬럼 데이터
  const renderItem: ListRenderItem<ScheduleDefaultProps> = ({item, index}) => {
    return (
      <View key={`day-schedule-time-item-${index}`} style={styles.row}>
        <DaySchedulesTime
          scheduleData={item}
          style={[styles.cell, styles.cellFirst]}
        />
        <View style={[styles.cell]}>
          <DaySchedulesLecture scheduleData={item} />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      refreshing={isLoading}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.scheduleContent,
        dayScheduleData?.scheduleList?.length === 0 && {flexGrow: 1},
      ]}
      ListHeaderComponent={<DaySchedulesHeader />}
      renderItem={renderItem}
      data={dayScheduleData?.scheduleList ?? []}
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

import {ListRenderItem, StyleSheet} from 'react-native';

import {useRecoilValue} from 'recoil';

import {CustomFlatList} from '#components/common/CustomScrollComponents';
import NoData from '#components/common/NoData';
import {COLORS} from '#constants/colors.ts';
import {REQ_DATE_FORMAT} from '#constants/common.ts';
import DaySchedulesHeader from '#containers/DailySchedules/components/DaySchedulesHeader.tsx';
import DaySchedulesItem from '#containers/DailySchedules/components/DaySchedulesItem.tsx';
import {useGetDaySchedule} from '#containers/DailySchedules/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {ScheduleDefaultProps} from '#types/schedule.ts';

const DaySchedules = () => {
  const selectAcademy = useRecoilValue(GlobalState.selectedAcademy); // 선택된 기관
  const {date} = useRecoilValue(scheduleState.selectedCalendarDate); // 선택된 날짜
  // 스케쥴 데이터
  const {dayScheduleData, refetchDaySchedule, isLoading} = useGetDaySchedule({
    academyId: selectAcademy,
    date: date.format(REQ_DATE_FORMAT),
  });

  // 시간/강의 컬럼 데이터
  const renderItem: ListRenderItem<ScheduleDefaultProps> = ({item, index}) => {
    return <DaySchedulesItem item={item} index={index} />;
  };

  return (
    <CustomFlatList
      style={styles.container}
      renderItem={renderItem}
      data={dayScheduleData?.scheduleList ?? []}
      refreshing={isLoading}
      onRefresh={refetchDaySchedule}
      contentContainerStyle={[
        styles.scheduleContent,
        dayScheduleData?.scheduleList?.length === 0 && {
          flexGrow: 1,
          marginBottom: 20,
        },
      ]}
      ListHeaderComponent={<DaySchedulesHeader />}
      ListEmptyComponent={<NoData fullHeight message="✏️ 강의 일정이 없습니다." />}
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
});

export default DaySchedules;

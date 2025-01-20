import {useMemo} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';

import {Moment} from 'moment';
import {useRecoilValue} from 'recoil';

import {CustomFlatList} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import {REQ_DATE_FORMAT} from '#constants/common.ts';
import DaysLabel from '#containers/WeeklySchedules/components/DaysLabel.tsx';
import WeeklyGridItem from '#containers/WeeklySchedules/components/WeeklyGridItem.tsx';
import {useGetWeekSchedule} from '#containers/WeeklySchedules/hooks/useApi.ts';
import {generateHours} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';
import GlobalState from '#recoil/Global';

interface TimelineCalendarProps {
  date: Moment;
}

const WeeklyGrid = ({date}: TimelineCalendarProps) => {
  const selectAcademy = useRecoilValue(GlobalState.selectedAcademy);
  const {
    formattedData: scheduleData,
    timeLineData,
    refetchWeekSchedule,
    isLoading,
  } = useGetWeekSchedule({
    academyId: selectAcademy,
    date: date.format(REQ_DATE_FORMAT),
  });

  const hours = useMemo(
    () => generateHours(timeLineData.timeLineStart, timeLineData.timeLineEnd),
    [timeLineData],
  );

  const renderItem: ListRenderItem<string> = ({item, index}) => {
    return <WeeklyGridItem item={item} index={index} scheduleData={scheduleData} hours={hours} />;
  };

  return (
    <CustomFlatList
      style={{marginBottom: 10}}
      contentContainerStyle={[styles.contents, {flex: hours.length > 0 ? 0 : 1}]}
      keyExtractor={item => item}
      data={hours}
      renderItem={renderItem}
      initialNumToRender={72}
      onRefresh={refetchWeekSchedule}
      refreshing={isLoading}
      ListHeaderComponent={<DaysLabel date={date} />}
      ListFooterComponentStyle={styles.footerForNodata}
      ListFooterComponent={
        <CText text={scheduleData?.length || isLoading ? '' : '강의 일정이 없습니다.'} />
      }
      scrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  contents: {
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 10,
  },
  footerForNodata: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: '-50%'}, {translateY: '-50%'}],
  },
});
export default WeeklyGrid;

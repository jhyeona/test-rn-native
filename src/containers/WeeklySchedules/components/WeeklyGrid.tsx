import {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {QueryObserverResult} from '@tanstack/react-query';
import {Moment} from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import {WEEKLY_SCHEDULE_LEFT_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';
import DaysLabel from '#containers/WeeklySchedules/components/DaysLabel.tsx';
import {
  TimeLineDataProps,
  WeekScheduleFormatProps,
} from '#containers/WeeklySchedules/hooks/useApi.ts';
import {
  generateHours,
  getRowSpan,
} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';

const FIVE_MINUTES_HEIGHTS = 5;
const days = ['월', '화', '수', '목', '금', '토', '일'];

interface TimelineCalendarProps {
  date: Moment;
  timeLineData: TimeLineDataProps;
  scheduleData?: WeekScheduleFormatProps[];
  refetch?: () => Promise<QueryObserverResult<any, unknown>>;
}

const WeeklyGrid = ({
  date,
  scheduleData,
  timeLineData,
  refetch,
}: TimelineCalendarProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // 당겨서 새로고침
  const onRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      refetch &&
        refetch().then(() => {
          setIsLoading(false);
        });
    }, 100);
  };

  const hours = useMemo(
    () => generateHours(timeLineData.timeLineStart, timeLineData.timeLineEnd),
    [timeLineData],
  );

  const scheduleDataMap = useMemo(() => {
    const map: Record<
      string,
      Record<string, WeekScheduleFormatProps | undefined>
    > = {};

    if (scheduleData) {
      days.forEach(day => {
        map[day] = {};
        hours.forEach(time => {
          map[day][time] = scheduleData?.find(schedule => {
            return schedule.day === day && schedule.startTime === time;
          });
        });
      });
    }

    return map;
  }, [scheduleData]);

  const renderRow = ({item: time, index: i}: {item: string; index: number}) => {
    return (
      <View style={styles.row} key={time}>
        <View style={{width: WEEKLY_SCHEDULE_LEFT_WIDTH, position: 'relative'}}>
          {i % 6 === 0 && <Text style={styles.timeStyle}>{time}</Text>}
        </View>
        {days.map((day, j) => {
          // 해당 시간에 맞는 데이터가 있는지 확인
          const cellData = scheduleDataMap[day]?.[time];
          if (cellData) {
            // 시작 시간과 종료 시간의 차이를 구해, 칸을 병합
            const rowSpan = getRowSpan(cellData.startTime, cellData.endTime);
            const cellHeight = rowSpan * FIVE_MINUTES_HEIGHTS; // 각 칸의 높이를 5분 단위(6)로 계산

            // 시작 시간일 경우에만 셀 생성
            if (i === hours.indexOf(cellData.startTime)) {
              return (
                <View
                  key={`${day}-${time}`}
                  style={[styles.cell, styles.schedule]}>
                  <View
                    style={[
                      styles.scheduleCell,
                      {height: cellHeight, backgroundColor: cellData.bgColor},
                    ]}>
                    <CText
                      text={cellData.lectureName}
                      color={cellData.textColor}
                      fontSize={11}
                      style={styles.lectureName}
                    />
                  </View>
                </View>
              );
            } else if (i < hours.indexOf(cellData.endTime)) {
              return null;
            }
          }
          // 일정이 없는 칸
          return (
            <View
              key={`${day}-${time}`}
              style={[
                styles.cell,
                {
                  borderColor: COLORS.lightGray,
                  borderLeftWidth: j === 0 || i === hours.length - 1 ? 0 : 1,
                  borderTopWidth: i % 6 === 0 ? 1 : 0,
                  height: FIVE_MINUTES_HEIGHTS,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={<DaysLabel date={date} />}
      data={hours}
      renderItem={renderRow}
      refreshing={isLoading}
      onRefresh={onRefresh}
      keyExtractor={item => item}
      contentContainerStyle={{
        flex: hours.length > 0 ? 0 : 1,
        marginTop: 10,
        marginBottom: 20,
      }}
      style={{marginBottom: 20}}
      scrollEnabled={true}
      ListFooterComponentStyle={styles.footerForNodata}
      ListFooterComponent={
        <CText text={scheduleData?.length ? '' : '강의 일정이 없습니다.'} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: FIVE_MINUTES_HEIGHTS,
  },
  timeStyle: {
    position: 'absolute',
    top: -FIVE_MINUTES_HEIGHTS,
    fontSize: 12,
  },
  schedule: {
    padding: 0.5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleCell: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    padding: 4,
    width: '100%',
    zIndex: 2,
  },
  lectureName: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  footerForNodata: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: '-50%'}, {translateY: '-50%'}],
  },
});
export default WeeklyGrid;

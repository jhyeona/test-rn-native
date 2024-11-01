import {useEffect, useState} from 'react';

import {useQuery} from '@tanstack/react-query';
import moment from 'moment';

import {WeeklyScheduleQueryOptions} from '#containers/WeeklySchedules/services/queries.ts';
import {getAdjustedTimes} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';
import {getRandomColor} from '#containers/WeeklySchedules/utils/textToColor.ts';
import {useHandleError, useLoadingEffect} from '#hooks/useApi.ts';
import {GetScheduleProps} from '#types/schedule.ts';

export interface WeekScheduleFormatProps {
  startTime: string;
  endTime: string;
  day: string;
  lectureName: string;
  textColor: string;
  bgColor: string;
}
export interface TimeLineDataProps {
  timeLineStart: string;
  timeLineEnd: string;
}

export const useGetWeekSchedule = (payload: GetScheduleProps) => {
  const [formattedData, setFormattedData] = useState<WeekScheduleFormatProps[]>([]);
  const [timeLineData, setTimeLineData] = useState<TimeLineDataProps>({
    // 주간일정 캘린더의 타임라인을 표시할 시작/종료 시간
    timeLineStart: '09:00',
    timeLineEnd: '15:00',
  });

  const {data, refetch, fetchStatus, status, error, isError} = useQuery(
    WeeklyScheduleQueryOptions.getWeeklySchedules(payload),
  );

  useEffect(() => {
    if (data) {
      const adjustTimes = getAdjustedTimes(data.scheduleList);
      setTimeLineData({
        timeLineStart: adjustTimes.adjustedEarliest ?? '09:00',
        timeLineEnd: adjustTimes.adjustedLatest ?? '15:00',
      }); // 데이터가 없을 경우 09:00~15:00 으로 세팅
      const formatted = data.scheduleList.map(item => {
        const colors = getRandomColor(item.lecture.lectureName);
        const startTime = moment(item.scheduleStartTime);
        const endTime = moment(item.scheduleEndTime);
        return {
          startTime: startTime.format('HH:mm'),
          endTime: endTime.format('HH:mm'),
          day: moment(item.scheduleStartTime).format('dd'),
          lectureName: item.lecture.lectureName,
          textColor: colors.text,
          bgColor: colors.bg,
        };
      });
      setFormattedData(formatted);
    }
  }, [data]);

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {
    weekScheduleData: data,
    formattedData,
    timeLineData,
    refetchWeekSchedule: refetch,
  };
};

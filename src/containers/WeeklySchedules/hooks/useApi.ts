import {useEffect, useState} from 'react';

import {useQuery} from '@tanstack/react-query';
import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import {WeeklyScheduleQueryOptions} from '#containers/WeeklySchedules/services/queries.ts';
import {getAdjustedTimes} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';
import {getRandomColor} from '#containers/WeeklySchedules/utils/textToColor.ts';
import GlobalState from '#recoil/Global';
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
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const [formattedData, setFormattedData] = useState<WeekScheduleFormatProps[]>(
    [],
  );
  const [timeLineData, setTimeLineData] = useState<TimeLineDataProps>({
    timeLineStart: '00:00',
    timeLineEnd: '00:00',
  });

  const {data, refetch, fetchStatus, status} = useQuery(
    WeeklyScheduleQueryOptions.getWeeklySchedules(payload),
  );

  useEffect(() => {
    if (data) {
      const timeLineTimes = getAdjustedTimes(data.scheduleList);
      setTimeLineData({
        timeLineStart: timeLineTimes.adjustedEarliest ?? '00:00',
        timeLineEnd: timeLineTimes.adjustedLatest ?? '00:00',
      });
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

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [fetchStatus, setIsLoading]);

  return {
    weekScheduleData: data,
    formattedData,
    timeLineData,
    refetchWeekSchedule: refetch,
  };
};

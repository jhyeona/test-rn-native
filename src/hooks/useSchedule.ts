import {requestGetDaySchedule} from '../apis/schedule.ts';
import {useSetRecoilState} from 'recoil';
import {useEffect} from 'react';
import scheduleState from '../recoil/Schedule';
import {useQuery} from '@tanstack/react-query';

export const getDaySchedule = async (date: string) => {
  const response = await requestGetDaySchedule(date);
  return response.data.data;
};

export const useGetDaySchedule = (date: string) => {
  const setDaySchedule = useSetRecoilState(scheduleState.dayScheduleState);
  const {data} = useQuery({
    queryKey: ['daySchedule', date],
    queryFn: async () => {
      return getDaySchedule(date);
    },
    enabled: !!date,
  });
  useEffect(() => {
    if (!data) return;
    setDaySchedule(data);
  });
  return data;
};

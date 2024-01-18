import {requestGetDaySchedule} from '../apis/schedule.ts';
import {useSetRecoilState} from 'recoil';
import {useEffect} from 'react';
import scheduleState from '../recoil/Schedule';
import {useQuery} from '@tanstack/react-query';
import {GetScheduleProps} from '../types/schedule.ts';

export const getDaySchedule = async (data: GetScheduleProps) => {
  const response = await requestGetDaySchedule(data);
  return response.data.data;
};

export const useGetDaySchedule = (args: GetScheduleProps) => {
  const setDaySchedule = useSetRecoilState(scheduleState.dayScheduleState);
  const {data} = useQuery({
    queryKey: ['daySchedule', args],
    queryFn: async () => {
      return getDaySchedule(args);
    },
    enabled: !!args.academyId,
  });
  useEffect(() => {
    if (!data) return;
    setDaySchedule(data);
  });
};

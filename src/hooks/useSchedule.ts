import {
  requestGetDaySchedule,
  requestGetScheduleHistory,
  requestGetWeekSchedule,
  requestPostEventComeback,
  requestPostEventComplete,
  requestPostEventEnter,
  requestPostEventLeave,
} from '../apis/schedule.ts';
import {useSetRecoilState} from 'recoil';
import {useEffect} from 'react';
import scheduleState from '../recoil/Schedule';
import {useMutation, useQuery} from '@tanstack/react-query';
import {EventProps, GetScheduleProps} from '../types/schedule.ts';

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

export const getWeekSchedule = async (data: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(data);
  return response.data.data;
};

export const useGetWeekSchedule = () => {
  const {mutateAsync, data, status} = useMutation({
    mutationFn: async (args: GetScheduleProps) => {
      return getWeekSchedule(args);
    },
  });
  return {mutateAsync, data, status};
};

export const postEventEnter = async (data: EventProps) => {
  const response = await requestPostEventEnter(data);
  return response.data.data;
};

export const postEventComplete = async (data: EventProps) => {
  const response = await requestPostEventComplete(data);
  return response.data.data;
};

export const postEventLeave = async (data: EventProps) => {
  const response = await requestPostEventLeave(data);
  return response.data.data;
};

export const postEventComeback = async (data: EventProps) => {
  const response = await requestPostEventComeback(data);
  return response.data.data;
};

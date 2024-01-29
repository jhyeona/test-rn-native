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
import {useQuery} from '@tanstack/react-query';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  PostEventProps,
} from '../types/schedule.ts';

export const getDaySchedule = async (data: GetScheduleProps) => {
  const response = await requestGetDaySchedule(data);
  return response.data?.data;
};

export const useGetDaySchedule = (args: GetScheduleProps) => {
  const setDaySchedule = useSetRecoilState(scheduleState.dayScheduleState);
  const {data} = useQuery({
    queryKey: ['daySchedule', args],
    queryFn: async () => {
      return getDaySchedule(args);
    },
    enabled: !!args.academyId,
    refetchInterval: 1000,
  });
  useEffect(() => {
    if (!data) return;
    setDaySchedule(data);
  }, [data, setDaySchedule]);
};

export const getWeekSchedule = async (data: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(data);
  return response.data?.data;
};

export const useGetWeekSchedule = (args: GetScheduleProps) => {
  const setWeekSchedule = useSetRecoilState(scheduleState.weekScheduleState);
  const {data} = useQuery({
    queryKey: ['weekSchedule', args],
    queryFn: async () => {
      return getWeekSchedule(args);
    },
    enabled: !!args.academyId,
  });
  useEffect(() => {
    if (!data) return;
    setWeekSchedule(data);
  }, [data, setWeekSchedule]);
};

export const postEventEnter = async (data: PostEventProps) => {
  const response = await requestPostEventEnter(data);
  return response.data?.data;
};

export const postEventComplete = async (data: PostEventProps) => {
  const response = await requestPostEventComplete(data);
  return response.data?.data;
};

export const postEventLeave = async (data: PostEventProps) => {
  const response = await requestPostEventLeave(data);
  return response.data?.data;
};

export const postEventComeback = async (data: PostEventProps) => {
  const response = await requestPostEventComeback(data);
  return response.data?.data;
};

export const getScheduleHistory = async (data: GetScheduleHistoryProps) => {
  const response = await requestGetScheduleHistory(data);
  return response.data?.data;
};

import {
  requestGetDaySchedule,
  requestGetEventHistory,
  requestGetLectureInfo,
  requestGetScheduleHistory,
  requestGetWeekSchedule,
  requestPostEventAttend,
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

export const getDaySchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetDaySchedule(payload);
  return response.data?.data;
};

export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const setDaySchedule = useSetRecoilState(scheduleState.dayScheduleState);
  const {data} = useQuery({
    queryKey: ['daySchedule', payload],
    queryFn: async () => {
      return getDaySchedule(payload);
    },
    enabled: !!payload.academyId,
    refetchInterval: 1000,
  });
  useEffect(() => {
    if (!data) return;
    setDaySchedule(data);
  }, [data, setDaySchedule]);
};

export const getWeekSchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(payload);
  return response.data?.data;
};

export const useGetWeekSchedule = (payload: GetScheduleProps) => {
  const setWeekSchedule = useSetRecoilState(scheduleState.weekScheduleState);
  const {data} = useQuery({
    queryKey: ['weekSchedule', payload],
    queryFn: async () => {
      return getWeekSchedule(payload);
    },
    enabled: !!payload.academyId,
  });
  useEffect(() => {
    if (!data) return;
    setWeekSchedule(data);
  }, [data, setWeekSchedule]);
};

export const postEventEnter = async (payload: PostEventProps) => {
  const response = await requestPostEventEnter(payload);
  return response.data?.data;
};

export const postEventComplete = async (payload: PostEventProps) => {
  const response = await requestPostEventComplete(payload);
  return response.data?.data;
};

export const postEventLeave = async (payload: PostEventProps) => {
  const response = await requestPostEventLeave(payload);
  return response.data?.data;
};

export const postEventAttend = async (payload: PostEventProps) => {
  const response = await requestPostEventAttend(payload);
  return response.data?.data;
};

export const postEventComeback = async (payload: PostEventProps) => {
  const response = await requestPostEventComeback(payload);
  return response.data?.data;
};

export const getScheduleHistory = async (payload: GetScheduleHistoryProps) => {
  const response = await requestGetScheduleHistory(payload);
  return response.data?.data;
};

export const useGetScheduleHistory = (payload: GetScheduleHistoryProps) => {
  const {data} = useQuery({
    queryKey: ['weekSchedule', payload],
    queryFn: async () => {
      return getScheduleHistory(payload);
    },
    enabled: !!payload.scheduleId,
    refetchInterval: 1000,
  });
  return data;
};

export const getEventHistory = async (payload: {
  academyId: number;
  startDate: string;
  endDate: string;
}) => {
  const response = await requestGetEventHistory(payload);
  return response.data?.data;
};

export const getLectureInfo = async (payload: GetScheduleHistoryProps) => {
  const response = await requestGetLectureInfo(payload);
  return response.data?.data;
};

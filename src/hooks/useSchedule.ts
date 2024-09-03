import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

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
} from '#apis/schedule.ts';
import globalState from '#recoil/Global/index.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  PostEventProps,
} from '#types/schedule.ts';

export const getDaySchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetDaySchedule(payload);
  return response.data?.data;
};

export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);

  const {data, refetch, status} = useQuery({
    queryKey: ['daySchedule', payload],
    queryFn: async () => {
      return getDaySchedule(payload);
    },
    enabled: !!payload.academyId,
  });

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, setIsLoading]);

  return {dayScheduleData: data, refetchDaySchedule: refetch};
};

export const getWeekSchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(payload);
  return response.data?.data;
};

export const useGetWeekSchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);

  const {data, refetch, fetchStatus} = useQuery({
    queryKey: ['weekSchedule', payload],
    queryFn: async () => {
      return getWeekSchedule(payload);
    },
    enabled: !!payload.academyId,
  });

  useEffect(() => {
    setIsLoading(true);
    if (fetchStatus === 'idle') {
      setIsLoading(false);
    }
  }, [fetchStatus, setIsLoading]);

  return {weekScheduleData: data, refetchWeekSchedule: refetch};
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
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const {data, status, refetch} = useQuery({
    queryKey: ['weekSchedule', payload],
    queryFn: async () => {
      return getScheduleHistory(payload);
    },
    enabled: !!payload.scheduleId,
  });

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, setIsLoading]);

  return {data, refetch};
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

import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestGetEventHistory,
  requestGetLectureInfo,
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

export const getWeekSchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(payload);
  return response;
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
  return response;
};

export const postEventComplete = async (payload: PostEventProps) => {
  const response = await requestPostEventComplete(payload);
  return response;
};

export const postEventLeave = async (payload: PostEventProps) => {
  const response = await requestPostEventLeave(payload);
  return response;
};

export const postEventAttend = async (payload: PostEventProps) => {
  const response = await requestPostEventAttend(payload);
  return response;
};

export const postEventComeback = async (payload: PostEventProps) => {
  const response = await requestPostEventComeback(payload);
  return response;
};

export const getEventHistory = async (payload: {
  academyId: number;
  startDate: string;
  endDate: string;
}) => {
  const response = await requestGetEventHistory(payload);
  return response;
};

export const getLectureInfo = async (payload: GetScheduleHistoryProps) => {
  const response = await requestGetLectureInfo(payload);
  return response;
};

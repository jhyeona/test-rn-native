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
import globalState from '../recoil/Global/index.ts';

export const getDaySchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetDaySchedule(payload);
  return response.data?.data;
};

export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const setDaySchedule = useSetRecoilState(scheduleState.dayScheduleState);

  const {data, fetchStatus} = useQuery({
    queryKey: ['daySchedule', payload],
    queryFn: async () => {
      return getDaySchedule(payload);
    },
    enabled: !!payload.academyId,
    // refetchInterval: 1000,
  });

  useEffect(() => {
    setIsLoading(true);
    if (fetchStatus === 'idle') {
      setIsLoading(false);
    }
  }, [fetchStatus, setIsLoading]);

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
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const setWeekSchedule = useSetRecoilState(scheduleState.weekScheduleState);
  const {data, fetchStatus} = useQuery({
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
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const {data, status} = useQuery({
    queryKey: ['weekSchedule', payload],
    queryFn: async () => {
      return getScheduleHistory(payload);
    },
    enabled: !!payload.scheduleId,
    refetchInterval: 1000,
  });

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success') {
      setIsLoading(false);
    }
  }, [status, setIsLoading]);

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

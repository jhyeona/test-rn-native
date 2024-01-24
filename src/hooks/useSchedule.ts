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
import {useEffect, useMemo, useState} from 'react';
import scheduleState from '../recoil/Schedule';
import {useQuery} from '@tanstack/react-query';
import {
  EventProps,
  GetScheduleHistoryProps,
  GetScheduleProps,
} from '../types/schedule.ts';

export const getDaySchedule = async (data: GetScheduleProps) => {
  const response = await requestGetDaySchedule(data);
  return response.data.data;
};

export const useGetDaySchedule = (args: GetScheduleProps) => {
  const [test, setTest] = useState(null);
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
    setTest(data.scheduleList.filter(item => item.lecture.length > 0));
  }, [data]);
};

export const getWeekSchedule = async (data: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(data);
  return response.data.data;
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
  });
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

export const getScheduleHistory = async (data: GetScheduleHistoryProps) => {
  const response = await requestGetScheduleHistory(data);
  return response.data.data;
};

export const useGetScheduleHistory = (args: GetScheduleHistoryProps) => {
  // const setScheduleHistory = useSetRecoilState(
  //   scheduleState.nowScheduleHistoryState,
  // );
  const {data} = useQuery({
    queryKey: ['scheduleHistory', args],
    queryFn: async () => {
      return getScheduleHistory(args);
    },
    enabled: !!args.scheduleId,
  });
  useEffect(() => {
    if (!data) return;
    // setScheduleHistory(data);
  }, [data]);
  return data;
};

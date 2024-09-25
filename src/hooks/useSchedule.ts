import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestGetEventHistory,
  requestGetLectureInfo,
  requestGetWeekSchedule,
} from '#apis/schedule.ts';
import GlobalState from '#recoil/Global/index.ts';
import {GetScheduleHistoryProps, GetScheduleProps} from '#types/schedule.ts';

export const getWeekSchedule = async (payload: GetScheduleProps) => {
  const response = await requestGetWeekSchedule(payload);
  return response;
};

export const useGetWeekSchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
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

export const getEventHistory = async (payload: {
  academyId: string;
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

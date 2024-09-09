import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {ScheduleQueryOptions} from '#containers/DailySchedules/services/queries.ts';
import globalState from '#recoil/Global';
import {GetScheduleHistoryProps, GetScheduleProps} from '#types/schedule.ts';

// 하루 일정
export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const {data, refetch, status, fetchStatus} = useQuery(
    ScheduleQueryOptions.getDaySchedules(payload),
  );

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, setIsLoading]);

  return {dayScheduleData: data, refetchDaySchedule: refetch};
};

// 일정에 기록된 스케쥴 데이터
export const useGetScheduleHistory = (payload: GetScheduleHistoryProps) => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const {data, status, refetch} = useQuery(
    ScheduleQueryOptions.getDayScheduleHistory(payload),
  );

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, setIsLoading]);

  return {historyData: data, refetchHistoryData: refetch};
};

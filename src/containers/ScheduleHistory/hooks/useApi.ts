import {useQuery} from '@tanstack/react-query';

import {requestGetEventHistory} from '#containers/ScheduleHistory/services';
import {useHandleError, useLoadingEffect} from '#hooks/useApi.ts';
import {ReqGetScheduleHistory} from '#types/schedule.ts';

export const useGetHistory = (payload: ReqGetScheduleHistory) => {
  const {data, refetch, fetchStatus, status, isError, error} = useQuery({
    queryKey: ['getHistory', payload],
    queryFn: async () => {
      return requestGetEventHistory(payload);
    },
    enabled: !!payload.academyId,
  });

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {
    getHistory: data,
    refetchHistory: refetch,
    isLoading: status === 'pending' && fetchStatus === 'fetching',
  };
};

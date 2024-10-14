import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestGetEventHistory} from '#containers/ScheduleHistory/services';
import {useHandleError} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {ReqGetScheduleHistory} from '#types/schedule.ts';

export const useGetHistory = (payload: ReqGetScheduleHistory) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  const {data, refetch, fetchStatus, status, isError, error} = useQuery({
    queryKey: ['getHistory', payload],
    queryFn: async () => {
      return requestGetEventHistory(payload);
    },
    enabled: !!payload.academyId,
  });

  useHandleError(isError, error);
  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [fetchStatus, setIsLoading]);

  return {
    getHistory: data,
    refetchHistory: refetch,
    isLoading: status === 'pending' && fetchStatus === 'fetching',
  };
};

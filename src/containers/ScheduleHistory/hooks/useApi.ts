import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestGetEventHistory} from '#apis/schedule.ts';
import GlobalState from '#recoil/Global';
import {ReqGetScheduleHistory} from '#types/schedule.ts';

export const useGetHistory = (payload: ReqGetScheduleHistory) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, refetch, fetchStatus, status} = useQuery({
    queryKey: ['getHistory', payload],
    queryFn: async () => {
      return requestGetEventHistory(payload);
    },
    enabled: !!payload.academyId,
  });

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [fetchStatus, setIsLoading]);

  return {getHistory: data, refetchHistory: refetch};
};

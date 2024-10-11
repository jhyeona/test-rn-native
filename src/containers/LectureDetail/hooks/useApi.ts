import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestGetLectureInfo} from '#containers/LectureDetail/services';
import GlobalState from '#recoil/Global';
import {GetScheduleHistoryProps} from '#types/schedule.ts';

export const useGetLectureInfo = (payload: GetScheduleHistoryProps) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, refetch, fetchStatus, status} = useQuery({
    queryKey: ['getLectureInfo', payload],
    queryFn: async () => {
      return requestGetLectureInfo(payload);
    },
    enabled: !!payload.scheduleId,
  });

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [fetchStatus, setIsLoading]);

  return {lectureInfo: data, refetchHistory: refetch};
};

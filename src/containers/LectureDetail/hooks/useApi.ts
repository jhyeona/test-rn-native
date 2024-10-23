import {useQuery} from '@tanstack/react-query';

import {requestGetLectureInfo} from '#containers/LectureDetail/services';
import {useLoadingEffect} from '#hooks/useApi.ts';
import {GetScheduleHistoryProps} from '#types/schedule.ts';

export const useGetLectureInfo = (payload: GetScheduleHistoryProps) => {
  const {data, refetch, fetchStatus, status} = useQuery({
    queryKey: ['getLectureInfo', payload],
    queryFn: async () => {
      return requestGetLectureInfo(payload);
    },
    enabled: !!payload.scheduleId,
  });

  useLoadingEffect(status, fetchStatus);

  return {lectureInfo: data, refetchHistory: refetch};
};

import {
  requestGetReasonDetails,
  requestGetReasonList,
} from '#containers/ReasonStatement/services/index.ts';
import {ReqGetReasonDetails, ReqGetReasonList} from '#types/reason.ts';

export const ReasonQueryOptions = {
  getReasonList: (payload: ReqGetReasonList) => ({
    queryKey: ['reasonList', payload],
    queryFn: ({pageParam}: {pageParam: number}) =>
      requestGetReasonList({...payload, page: pageParam}),
    initialPageParam: 1, // 무한 스크롤을 위해 useInfiniteQuery 사용
    enabled: !!payload.academyId,
  }),
  getReasonDetails: (payload: ReqGetReasonDetails) => ({
    queryKey: ['reasonDetails', payload],
    queryFn: () => {
      return requestGetReasonDetails(payload);
    },
    enabled: !!payload.reasonId,
  }),
};

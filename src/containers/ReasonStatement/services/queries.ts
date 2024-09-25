import {
  requestGetReasonDetails,
  requestGetReasonList,
} from '#containers/ReasonStatement/services/index.ts';
import {ReqGetReasonDetails, ReqGetReasonList} from '#types/reason.ts';

export const ReasonQueryOptions = {
  getReasonList: (payload: ReqGetReasonList) => ({
    queryKey: ['reasonList', payload],
    queryFn: () => requestGetReasonList(payload),
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

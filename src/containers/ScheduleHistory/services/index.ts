import {requestGet} from '#apis/index.ts';
import {
  ReqGetScheduleHistory,
  ResSchedulePeriodDataProps,
} from '#types/schedule.ts';

export const requestGetEventHistory = async (
  payload: ReqGetScheduleHistory,
): Promise<ResSchedulePeriodDataProps> => {
  // 기간별 이벤트 히스토리 조회
  const url = `/event/history/academy/${payload.academyId}/start/${payload.startDate}/end/${payload.endDate}`;
  return requestGet(url);
};

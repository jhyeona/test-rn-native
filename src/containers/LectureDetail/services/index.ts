import {requestGet} from '#apis/index.ts';
import {
  GetScheduleHistoryProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';

export const requestGetLectureInfo = async (
  payload: GetScheduleHistoryProps,
): Promise<ScheduleHistoryDataProps> => {
  // 강의 상세
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};

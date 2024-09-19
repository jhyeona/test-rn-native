import {
  requestGetDaySchedule,
  requestGetScheduleHistory,
} from '#containers/DailySchedules/services/index.ts';
import {GetScheduleHistoryProps, GetScheduleProps} from '#types/schedule.ts';

export const ScheduleQueryOptions = {
  getDaySchedules: (payload: GetScheduleProps) => ({
    queryKey: ['daySchedule', payload],
    queryFn: () => requestGetDaySchedule(payload),
    enabled: !!payload.academyId,
  }),
  getDayScheduleHistory: (payload: GetScheduleHistoryProps) => ({
    queryKey: ['scheduleHistory', payload],
    queryFn: () => {
      return requestGetScheduleHistory(payload);
    },
    enabled: !!payload.scheduleId,
  }),
};

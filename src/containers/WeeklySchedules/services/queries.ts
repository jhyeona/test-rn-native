import {requestGetWeekSchedule} from '#containers/WeeklySchedules/services/index.ts';
import {GetScheduleProps} from '#types/schedule.ts';

export const WeeklyScheduleQueryOptions = {
  getWeeklySchedules: (payload: GetScheduleProps) => ({
    queryKey: ['weeklySchedule', payload],
    queryFn: () => requestGetWeekSchedule(payload),
    enabled: !!payload.academyId,
  }),
};

import moment, {Moment} from 'moment';
import {atom} from 'recoil';

import {ScheduleHistoryDataProps} from '#types/schedule.ts';

export const nowScheduleHistoryState = atom<ScheduleHistoryDataProps | null>({
  key: 'nowScheduleHistoryState',
  default: null,
});

export const selectedCalendarDate = atom<{
  isWeekly: boolean;
  date: Moment;
}>({
  key: 'selectedCalendarDate',
  default: {
    isWeekly: false,
    date: moment(),
  },
});

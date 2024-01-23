import {atom} from 'recoil';
import {DayScheduleProps, ScheduleProps} from '../../types/schedule.ts';

export const dayScheduleState = atom<DayScheduleProps | null>({
  key: 'dayScheduleState',
  default: null,
});

export const nowScheduleHistoryState = atom<ScheduleProps | null>({
  key: 'nowScheduleHistoryState',
  default: null,
});

import {atom} from 'recoil';
import {
  DayScheduleProps,
  ScheduleProps,
  WeekScheduleProps,
} from '../../types/schedule.ts';

export const dayScheduleState = atom<DayScheduleProps | null>({
  key: 'dayScheduleState',
  default: null,
});

export const weekScheduleState = atom<WeekScheduleProps | null>({
  key: 'weekScheduleState',
  default: null,
});

export const nowScheduleHistoryState = atom<ScheduleProps | null>({
  key: 'nowScheduleHistoryState',
  default: null,
});

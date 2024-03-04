import {atom} from 'recoil';
import {ScheduleDataProps, ScheduleHistoryDataProps} from '#types/schedule.ts';

export const dayScheduleState = atom<ScheduleDataProps | null>({
  key: 'dayScheduleState',
  default: null,
});

export const weekScheduleState = atom<ScheduleDataProps | null>({
  key: 'weekScheduleState',
  default: null,
});

export const nowScheduleHistoryState = atom<ScheduleHistoryDataProps | null>({
  key: 'nowScheduleHistoryState',
  default: null,
});

import {atom} from 'recoil';
import {DayScheduleProps} from '../../types/schedule.ts';

export const dayScheduleState = atom<DayScheduleProps | null>({
  key: 'dayScheduleState',
  default: null,
});

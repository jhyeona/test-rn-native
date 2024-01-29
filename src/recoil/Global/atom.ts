import {atom} from 'recoil';
import moment from 'moment';

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const selectDayScheduleDate = atom<string>({
  key: 'selectDayScheduleDate',
  default: moment().format('YYYYMMDD'),
});

export const selectWeekScheduleDate = atom<string>({
  key: 'selectWeekScheduleDate',
  default: moment().format('YYYYMMDD'),
});

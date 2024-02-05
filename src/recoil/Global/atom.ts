import {atom} from 'recoil';
import moment from 'moment';

export const globalLoadingState = atom<boolean>({
  key: 'globalLoadingState',
  default: true,
});

export const globalModalState = atom<{
  isVisible: boolean;
  title: string;
  message: string;
}>({
  key: 'globalModalState',
  default: {
    isVisible: false,
    title: '',
    message: '',
  },
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const selectDayScheduleDate = atom<string>({
  key: 'selectDayScheduleDate',
  default: moment().format('YYYY-MM-DD'),
});

export const selectWeekScheduleDate = atom<string>({
  key: 'selectWeekScheduleDate',
  default: moment().format('YYYYMMDD'),
});

export const selectedAcademy = atom<number>({
  key: 'selectedAcademy',
  default: 0,
});

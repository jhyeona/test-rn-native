import {atom} from 'recoil';
import moment from 'moment';
import {BeaconDataProps, BeaconProps, WifiProps} from '../../types/location.ts';

export const globalToastState = atom<{isVisible: boolean; message: string}>({
  key: 'globalToastState',
  default: {
    isVisible: false,
    message: '',
  },
});

export const globalLoadingState = atom<boolean>({
  key: 'globalLoadingState',
  default: false,
});

export const globalModalState = atom<{
  isVisible: boolean;
  title: string;
  message: string;
  isConfirm?: boolean;
  onPressConfirm?: () => void;
  onPressCancel?: () => void;
}>({
  key: 'globalModalState',
  default: {
    isVisible: false,
    title: '',
    message: '',
    isConfirm: false,
  },
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const beaconState = atom<BeaconProps[]>({
  key: 'beaconState',
  default: [],
});

export const wifiState = atom<WifiProps[]>({
  key: 'wifiState',
  default: [],
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

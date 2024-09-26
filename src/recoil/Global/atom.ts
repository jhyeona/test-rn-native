import {ReactNode} from 'react';

import {atom} from 'recoil';

import {BeaconProps, WifiProps} from '#types/location.ts';

export const globalToastState = atom<{
  isVisible: boolean;
  message?: string;
  content?: ReactNode;
  time?: number;
}>({
  key: 'globalToastState',
  default: {
    isVisible: false,
    message: '',
    time: 3000,
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

export const selectedAcademy = atom<string>({
  key: 'selectedAcademy',
  default: '',
});

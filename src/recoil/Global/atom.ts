import {ReactNode} from 'react';

import {atom} from 'recoil';

import {ACCESS_TOKEN} from '#constants/common.ts';
import {GlobalModalProps} from '#types/global.ts';
import {BeaconProps, WifiProps} from '#types/location.ts';
import {getStorageItem} from '#utils/storageHelper.ts';

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

export const globalModalState = atom<GlobalModalProps>({
  key: 'globalModalState',
  default: {
    isVisible: false,
    title: '',
    message: '',
    isConfirm: false,
    hideButtons: false,
  },
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: !!getStorageItem(ACCESS_TOKEN),
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

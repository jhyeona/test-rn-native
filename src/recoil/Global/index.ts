import {
  beaconState,
  globalLoadingState,
  globalModalState,
  globalToastState,
  isLoginState,
  selectedAcademy,
  wifiState,
} from '#recoil/Global/atom.ts';

const globalState = {
  globalToastState,
  globalLoadingState,
  globalModalState,
  isLoginState,
  beaconState,
  wifiState,
  selectedAcademy,
};

export default globalState;

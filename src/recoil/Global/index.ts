import {
  beaconState,
  globalLoadingState,
  globalModalState,
  globalToastState,
  isLoginState,
  selectedAcademy,
  wifiState,
} from '#recoil/Global/atom.ts';

const GlobalState = {
  globalToastState,
  globalLoadingState,
  globalModalState,
  isLoginState,
  wifiState,
  selectedAcademy,
  beaconState,
};

export default GlobalState;

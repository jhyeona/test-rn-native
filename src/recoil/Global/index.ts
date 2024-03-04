import {
  beaconState,
  globalLoadingState,
  globalModalState,
  globalToastState,
  isLoginState,
  selectDayScheduleDate,
  selectedAcademy,
  selectWeekScheduleDate,
  wifiState,
} from '#recoil/Global/atom.ts';

const globalState = {
  globalToastState,
  globalLoadingState,
  globalModalState,
  isLoginState,
  beaconState,
  wifiState,
  selectDayScheduleDate,
  selectWeekScheduleDate,
  selectedAcademy,
};

export default globalState;

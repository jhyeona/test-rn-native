import {
  globalLoadingState,
  globalModalState,
  globalToastState,
  isLoginState,
  selectDayScheduleDate,
  selectedAcademy,
  selectWeekScheduleDate,
} from './atom.ts';

const globalState = {
  globalToastState,
  globalLoadingState,
  globalModalState,
  isLoginState,
  selectDayScheduleDate,
  selectWeekScheduleDate,
  selectedAcademy,
};

export default globalState;

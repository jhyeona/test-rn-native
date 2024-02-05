import {
  globalLoadingState,
  globalModalState,
  isLoginState,
  selectDayScheduleDate,
  selectedAcademy,
  selectWeekScheduleDate,
} from './atom.ts';

const globalState = {
  globalLoadingState,
  globalModalState,
  isLoginState,
  selectDayScheduleDate,
  selectWeekScheduleDate,
  selectedAcademy,
};

export default globalState;

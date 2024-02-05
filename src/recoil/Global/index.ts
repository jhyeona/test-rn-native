import {
  globalModalState,
  isLoginState,
  selectDayScheduleDate,
  selectedAcademy,
  selectWeekScheduleDate,
} from './atom.ts';

const globalState = {
  globalModalState,
  isLoginState,
  selectDayScheduleDate,
  selectWeekScheduleDate,
  selectedAcademy,
};

export default globalState;

import {
  isLoginState,
  selectDayScheduleDate,
  selectedAcademy,
  selectWeekScheduleDate,
} from './atom.ts';

const globalState = {
  isLoginState,
  selectDayScheduleDate,
  selectWeekScheduleDate,
  selectedAcademy,
};

export default globalState;

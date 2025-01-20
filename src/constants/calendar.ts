import {COLORS} from '#constants/colors.ts';

export const DAY_SCHEDULE_FIRST_CELL_WIDTH = 75; // 일일 캘린더
export const WEEKLY_SCHEDULE_LEFT_WIDTH = 50; // 주간 캘린더

export const timeTableTheme = {
  cellBorderColor: COLORS.layout,

  //event title
  eventTitle: {fontSize: 11},

  //Saturday style
  saturdayName: {color: 'black'},
  saturdayNumber: {color: 'black'},
  // saturdayNumberContainer: {backgroundColor: 'white'},

  //Sunday style
  sundayName: {color: 'black'},
  sundayNumber: {color: 'black'},
  // sundayNumberContainer: {backgroundColor: 'white'},

  //Today style
  todayName: {color: 'white'},
  todayNumber: {color: 'white'},
  todayNumberContainer: {backgroundColor: COLORS.primary},

  //Normal style
  dayName: {color: 'black'},
  dayNumber: {color: 'black'},
  dayNumberContainer: {backgroundColor: 'white'},

  //Loading style
  loadingBarColor: COLORS.primary,
};

import {COLORS} from '#constants/colors.ts';

export const FIRST_CELL_WIDTH = 80;

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

import {Platform} from 'react-native';

export const COLORS = {
  primary: '#1251D4',
  layout: '#D8D8D8',
  gray: '#828282',
  lightGray: '#F1F1F1',
  warning: '#FF6666',
  disabled: '#D9D9D9',
  placeholder: '#A0A0A0',
  primaryLight: '#EFF6FF',
  lineBlue: '#1251D433',

  // calendar event color
  light: {
    red: '#FDEAEA',
    orange: '#FFF5EA',
    green: '#E5F8EB',
    blue: '#E5F3FF',
    gray: '#E8E8E8',
  },
  dark: {
    red: '#E92C2C',
    orange: '#FF9F2D',
    green: '#00BA34',
    blue: '#0085FF',
    gray: '#585757',
  },
};

export const BOX_SHADOW = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    android: {
      elevation: 6, // = boxShadow
    },
  }),
};

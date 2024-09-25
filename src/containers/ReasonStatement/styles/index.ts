import {StyleSheet} from 'react-native';

import {COLORS} from '#constants/colors.ts';

export const reasonListTableStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
    backgroundColor: 'white',
  },
  row: {
    gap: 10,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  row1: {
    gap: 4,
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  row2: {
    flex: 0.5,
    justifyContent: 'center',
  },
  row3: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

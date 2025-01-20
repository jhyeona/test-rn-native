import {StyleSheet} from 'react-native';

import {COLORS} from '#constants/colors.ts';

export const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  version: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

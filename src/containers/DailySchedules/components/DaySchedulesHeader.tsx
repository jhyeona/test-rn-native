import React from 'react';
import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {DAY_SCHEDULE_FIRST_CELL_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';

const DaySchedulesHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={[styles.headerCell, styles.headerCellFirst]}>
        <CText
          style={styles.headerText}
          fontSize={16}
          fontWeight="700"
          color={COLORS.primary}
          text="시간"
        />
      </View>
      <View style={styles.headerCell}>
        <CText
          style={styles.headerText}
          fontSize={16}
          fontWeight="700"
          color={COLORS.primary}
          text="예정강의"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  headerCellFirst: {
    flex: 0,
    width: DAY_SCHEDULE_FIRST_CELL_WIDTH,
    borderRightWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DaySchedulesHeader;

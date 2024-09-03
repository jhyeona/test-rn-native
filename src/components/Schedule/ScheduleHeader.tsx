import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

interface ScheduleHeaderProps {
  isWeekend: boolean;
}

const ScheduleHeader = ({isWeekend}: ScheduleHeaderProps) => {
  const onPressRefreshCalendar = () => {
    console.log('onPressRefreshCalendar');
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <CText
          text={isWeekend ? '주간 일정' : '일간 일정'}
          fontWeight="700"
          fontSize={22}
        />
        <TouchableWithoutFeedback onPress={onPressRefreshCalendar}>
          <View>
            <SvgIcon style={styles.icon} name="Refresh" size={24} />
          </View>
        </TouchableWithoutFeedback>
        {/*<TouchableOpacity onPress={onPressRefreshCalendar}>*/}
        {/*  <SvgIcon style={styles.icon} name="Refresh" size={24} />*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ScheduleHeader;

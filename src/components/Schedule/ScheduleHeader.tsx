import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {COLORS} from '../../constants/colors.ts';
import CText from '../common/CustomText/CText.tsx';
import moment from 'moment';
import TextToggle from '../common/Toggle/TextToggle.tsx';
import SvgIcon from '../common/Icon/Icon.tsx';
import {weekOfMonth} from '../../utils/scheduleHelper.ts';

interface Props {
  isWeekend: boolean;
  setIsWeekend: (value: boolean) => void;
}

const ScheduleHeader = (props: Props) => {
  const {isWeekend, setIsWeekend} = props;

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <CText
          text={isWeekend ? '주간 일정' : '오늘 일정'}
          fontWeight="700"
          fontSize={22}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SvgIcon style={styles.icon} name="Calendar" size={24} />
          <CText
            text={
              isWeekend ? weekOfMonth(moment()) : moment().format('YYYY.MM.DD')
            }
            fontSize={16}
          />
        </View>
      </View>
      <TextToggle onToggle={value => setIsWeekend(value)} />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ScheduleHeader;

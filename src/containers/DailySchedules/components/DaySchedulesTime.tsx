import {useState} from 'react';
import {View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import moment from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import {ScheduleDefaultProps} from '#types/schedule.ts';
import {isBetween} from '#utils/scheduleHelper.ts';

const timeProps = {
  fontWeight: '600',
};

export const formattedDate = (date: string) => {
  return date.split('T')[1].slice(0, 5);
};

const DaySchedulesTime = ({
  scheduleData,
  style,
}: {
  scheduleData?: ScheduleDefaultProps;
  style?: StyleProp<ViewStyle>;
}) => {
  const [useArrow, setUseArrow] = useState(false);

  useGlobalInterval(() => {
    const isNow = isBetween(
      moment(scheduleData?.scheduleStartTime),
      moment(scheduleData?.scheduleEndTime),
    );
    setUseArrow(prev => (prev !== isNow ? isNow : prev));
  }, 3000);

  return (
    <View key={`schedule-time-${scheduleData?.scheduleId}`} style={style}>
      <CText
        {...timeProps}
        text={formattedDate(scheduleData?.scheduleStartTime ?? '--:--')}
      />
      <CText {...timeProps} text="~" />
      <CText
        {...timeProps}
        text={formattedDate(scheduleData?.scheduleEndTime ?? '--:--')}
      />
      {useArrow && <SvgIcon name="ScheduleTimeLIne" style={{marginTop: 10}} />}
    </View>
  );
};

export default DaySchedulesTime;

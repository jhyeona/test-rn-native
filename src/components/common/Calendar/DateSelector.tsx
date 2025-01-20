import React from 'react';
import {Pressable} from 'react-native';

import moment, {Moment} from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {DATE_FORMAT_DASH} from '#constants/common.ts';

interface Props {
  onPressCalendar: () => void;
  selectedDate: Date | string | Moment;
}

const DateSelector = (props: Props) => {
  const {onPressCalendar, selectedDate} = props;
  return (
    <>
      <Pressable
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: COLORS.layout,
          borderRadius: 7,
        }}
        onPress={onPressCalendar}>
        <CText text={moment(selectedDate).format(DATE_FORMAT_DASH)} />
        <SvgIcon name="CalendarDot" />
      </Pressable>
    </>
  );
};

export default DateSelector;

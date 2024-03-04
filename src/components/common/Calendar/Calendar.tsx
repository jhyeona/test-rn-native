import React from 'react';
import {COLORS} from '#constants/colors.ts';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {Pressable} from 'react-native';
import moment, {Moment} from 'moment';

interface Props {
  onPressCalendar: () => void;
  selectedDate: Date | string | Moment;
}

const Calendar = (props: Props) => {
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
        <CText text={moment(selectedDate).format('YYYY-MM-DD')} />
        <SvgIcon name="CalendarDot" />
      </Pressable>
    </>
  );
};

export default Calendar;

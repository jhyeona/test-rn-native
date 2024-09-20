import React, {useState} from 'react';
import {Pressable} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment, {Moment} from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

interface DatePickerProps {
  handleChangeDate?: (date: Moment) => void;
  defaultDate?: Date | string | Moment;
}

const DatePicker = ({handleChangeDate, defaultDate}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (handleChangeDate) handleChangeDate(moment(date));
    setSelectedDate(date);
    hideDatePicker();
  };

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
        onPress={showDatePicker}>
        <CText text={moment(defaultDate).format('YYYY-MM-DD')} />
        <SvgIcon name="CalendarDot" />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        locale="ko-KR"
      />
    </>
  );
};

export default DatePicker;

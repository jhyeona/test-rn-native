import {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment, {Moment} from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

interface DatePickerProps {
  handleDateSelection?: (date: Moment) => void;
  onDateChange?: Date;
  defaultDate?: string;
  disabled?: boolean;
  format?: string;
}

const DatePicker = ({
  handleDateSelection,
  onDateChange,
  defaultDate,
  disabled,
  format,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (handleDateSelection) handleDateSelection(moment(date));
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    if (defaultDate) {
      setSelectedDate(new Date(defaultDate));
    }
  }, [defaultDate]);

  useEffect(() => {
    if (onDateChange && onDateChange !== selectedDate) {
      setSelectedDate(onDateChange);
    }
  }, [onDateChange]);

  return (
    <>
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: COLORS.layout,
          borderRadius: 7,
          backgroundColor: disabled ? COLORS.lightGray : 'white',
        }}
        disabled={disabled}
        onPress={showDatePicker}>
        <CText
          color={disabled ? COLORS.placeholder : 'black'}
          text={moment(selectedDate).format(format ?? 'YYYY-MM-DD')}
          style={{paddingRight: 12}}
        />
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
        style={{zIndex: 1000}}
      />
    </>
  );
};

export default DatePicker;

import {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment, {Moment} from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {DATE_FORMAT} from '#constants/common.ts';

interface DatePickerProps {
  handleDateSelection?: (date: Moment) => void; // date 반환
  onDateChange?: Date; // 해당 값으로 값 변경
  defaultDate?: string; // 시작 시 할당값
  dateText?: string; // 선택된 값과 별개로 표시할 값
  format?: string; // 날짜 형식
  disabled?: boolean;
}

const DatePicker = ({
  handleDateSelection,
  onDateChange,
  defaultDate,
  disabled,
  format,
  dateText,
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
          minWidth: 140,
          borderWidth: 1,
          borderColor: COLORS.layout,
          borderRadius: 7,
          backgroundColor: disabled ? COLORS.lightGray : 'white',
        }}
        disabled={disabled}
        onPress={showDatePicker}>
        <CText
          color={disabled ? COLORS.placeholder : 'black'}
          text={dateText ?? moment(selectedDate).format(format ?? DATE_FORMAT)}
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

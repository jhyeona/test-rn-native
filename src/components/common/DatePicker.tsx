import React, {useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = props => {
  const {handleSetDate} = props;

  const [isPicker, setIsPicker] = useState(false);
  const [date, setDate] = useState('');

  const onSetDate = (pickerDate: Date | undefined) => {
    const formattedDate = moment(pickerDate).format('YYYY-MM-DD');
    if (handleSetDate) {
      handleSetDate(formattedDate);
    }
    setDate(formattedDate);
    setIsPicker(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsPicker(true)}>
        <Text>{date ? date : '날짜 (선택)'}</Text>
      </TouchableOpacity>

      {isPicker ? (
        <DateTimePicker
          value={new Date()}
          onChange={(e, pickerDate) => onSetDate(pickerDate)}
          display="calendar"
          maximumDate={new Date()}
          timeZoneName={'Asia/Seoul'}
        />
      ) : (
        ''
      )}
    </>
  );
};
export default DatePicker;

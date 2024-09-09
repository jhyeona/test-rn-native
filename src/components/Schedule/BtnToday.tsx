import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import scheduleState from '#recoil/Schedule';

const BtnToday = () => {
  const setDate = useSetRecoilState(scheduleState.selectedCalendarDate);
  const onPressSetToday = () => {
    setDate(prev => ({...prev, date: moment()}));
  };

  return (
    <CButton
      buttonStyle={{width: 50, height: 30}}
      text="오늘"
      onPress={onPressSetToday}
    />
  );
};

export default BtnToday;

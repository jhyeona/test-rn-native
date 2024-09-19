import {TouchableOpacity} from 'react-native';

import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';

const BtnToday = () => {
  const [{date}, setDate] = useRecoilState(scheduleState.selectedCalendarDate);
  const setToast = useSetRecoilState(GlobalState.globalToastState);
  const onPressSetToday = () => {
    if (date.isSame(moment(), 'day')) {
      setToast({
        isVisible: true,
        message: '오늘 일자 입니다.',
      });
      return;
    }
    setDate(prev => ({...prev, date: moment()}));
  };

  return (
    <TouchableOpacity onPress={onPressSetToday}>
      <SvgIcon name="TodayArrow" />
      <CText text="오늘" />
    </TouchableOpacity>
  );
};

export default BtnToday;

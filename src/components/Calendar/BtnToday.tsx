import {TouchableOpacity} from 'react-native';

import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {DATE_FORMAT} from '#constants/common.ts';
import {isDateInSameWeek} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';

const BtnToday = () => {
  const setToast = useSetRecoilState(GlobalState.globalToastState);
  const [{isWeekly, date}, setDate] = useRecoilState(
    scheduleState.selectedCalendarDate,
  );

  const showToast = (message: string) => {
    setToast({
      time: 1500,
      isVisible: true,
      message,
    });
  };

  const onPressSetToday = () => {
    // 주간 일정일 경우에는 이번주 내의 날짜인지 확인
    const isOnWeek =
      isWeekly &&
      isDateInSameWeek(new Date(date.format(DATE_FORMAT)), new Date());
    if (isOnWeek) {
      showToast('이번 주 일자 입니다.');
      return;
    }
    if (date.isSame(moment(), 'day')) {
      showToast('오늘 일자 입니다.');
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

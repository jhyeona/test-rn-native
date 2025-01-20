import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Config from 'react-native-config';

import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {IS_IOS} from '#constants/common.ts';
import {useGetAttendeeInfo} from '#containers/DailySchedules/hooks/useSchedules.ts';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import {checkPermissionWithModal} from '#permissions/utils/withModalHelper.ts';
import GlobalState from '#recoil/Global';
import {ScheduleDefaultProps} from '#types/schedule.ts';
import {initScanner, isInitScanner, startEscapeCheck} from '#utils/stickySdkHelper.ts';
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
  const {selectedAcademyUseEscapeCheck} = useGetAttendeeInfo();
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const [useEscapeLecture] = useState(
    scheduleData?.lecture.lectureUseEscapeCheck && selectedAcademyUseEscapeCheck,
  );

  useGlobalInterval(() => {
    const isNow = isBetween(
      moment(scheduleData?.scheduleStartTime),
      moment(scheduleData?.scheduleEndTime),
    );
    setUseArrow(prev => (prev !== isNow ? isNow : prev));
  }, 3000);

  // useEffect(() => {
  //   if (scheduleData && useArrow) {
  //     // 강의중인지 확인하여 자동으로 이탈체크를 시작하는 기능
  //     // prod 에서는 사용 불가 // Config.ENV === 'development' &&
  //     const scheduleId = scheduleData.scheduleId;
  //     const endTime = moment(scheduleData.scheduleEndTime).unix();
  //     console.log('schedule ID: ', scheduleId);
  //
  //     if (!isInitScanner()) {
  //       initScanner({isCellEnable: useEscapeLecture});
  //     }
  //
  //     const phonePermissionsCheck = checkPermissionWithModal({
  //       requestType: 'phone',
  //       setGlobalModalState,
  //     }).then();
  //
  //     if (!phonePermissionsCheck) return;
  //
  //     startEscapeCheck({scheduleId, endTime}).then();
  //   }
  // }, [useArrow]);

  return (
    <View key={`schedule-time-${scheduleData?.scheduleId}`} style={style}>
      <CText {...timeProps} text={formattedDate(scheduleData?.scheduleStartTime ?? '--:--')} />
      <CText {...timeProps} text="~" />
      <CText {...timeProps} text={formattedDate(scheduleData?.scheduleEndTime ?? '--:--')} />
      {useArrow && <SvgIcon name="ScheduleTimeLIne" style={{marginTop: 10}} />}
    </View>
  );
};

export default DaySchedulesTime;

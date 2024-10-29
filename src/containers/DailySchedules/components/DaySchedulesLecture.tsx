import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import moment from 'moment/moment';

import RotatingContainer from '#components/common/Animation/Rotator.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import StatusInfoContainer, {ColorType} from '#components/common/StatusInfoContainer';
import {DATE_FORMAT_DOT} from '#constants/common.ts';
import BtnSchedule from '#containers/DailySchedules/components/BtnSchedule.tsx';
import {allowScheduleTime} from '#containers/DailySchedules/utils/dateHelper.ts';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import {ScheduleDefaultProps} from '#types/schedule.ts';
import {isBetween} from '#utils/scheduleHelper.ts';

interface ScheduleStatusProps {
  colorType: ColorType;
  text: string;
}

const DaySchedulesLecture = ({
  scheduleData,
  style,
}: {
  scheduleData?: ScheduleDefaultProps;
  style?: StyleProp<ViewStyle>;
}) => {
  const [isDetailShown, setIsDetailSown] = useState(true);
  const [isBtnAvailable, setBtnAvailable] = useState(false);
  const [isAllowedAfterEnd, setIsAllowedAfterEnd] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusProps>({
    colorType: 'gray',
    text: '강의 종료',
  }); // 강의 예정 : red / 강의중 : blue / 강의 종료 : gray

  const formattedDate = (date?: string) => {
    return date ? moment(date).format(DATE_FORMAT_DOT) : '-';
  };

  const onPressLectureArrow = (isRotated: boolean) => {
    // console.log(isRotated);
    setIsDetailSown(isRotated);
  };

  // 현재시간을 기준으로 강의 진행 상태 표시
  const setStatusValue = () => {
    const now = moment();
    const newStatus: ScheduleStatusProps = now.isBefore(moment(scheduleData?.scheduleStartTime))
      ? {colorType: 'red', text: '강의 예정'}
      : now.isAfter(moment(scheduleData?.scheduleEndTime))
        ? {colorType: 'gray', text: '강의 종료'}
        : {colorType: 'blue', text: '강의중'};
    // 값이 변경된 경우에만 업데이트
    if (
      scheduleStatus.colorType !== newStatus.colorType ||
      scheduleStatus.text !== newStatus.text
    ) {
      setScheduleStatus(newStatus);
    }
  };

  // 강의 허용시간에 맞춰 출결/외출 버튼 표시
  const setAvailableTime = () => {
    if (scheduleData) {
      const {allowStartMinusTime, allowEndPlusTime, isAfter} = allowScheduleTime({
        scheduleData,
        startTime: scheduleData?.scheduleStartTime,
        endTime: scheduleData?.scheduleEndTime,
      });

      // 당일 퇴실 제한 여부에 따라 버튼 표시
      const allowEndTime = scheduleData?.lecture.lectureIsAllowedAfterEnd
        ? moment(scheduleData.scheduleEndTime).endOf('day')
        : allowEndPlusTime;
      const isAllowNow = isBetween(allowStartMinusTime, allowEndTime);
      setBtnAvailable(isAllowNow);

      // 강의 종료 후 + 퇴실 제한 없는 경우 퇴실 버튼만 살리기 위함
      setIsAllowedAfterEnd(isAfter && scheduleData?.lecture.lectureIsAllowedAfterEnd);
    }
  };

  useGlobalInterval(() => {
    setAvailableTime();
    setStatusValue();
  }, 3000);

  useEffect(() => {
    setAvailableTime();
    setStatusValue();
  }, [scheduleData]);

  return (
    <View style={[style, styles.container]}>
      <View
        style={{
          flex: 1,
          gap: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1}}>
          <CText // 강의 명
            text={scheduleData?.lecture.lectureName ?? '-'}
            fontSize={16}
            fontWeight="600"
            lineBreak
          />
          <CText // 강의 기간
            text={`${formattedDate(
              scheduleData?.lecture.lectureStartDate,
            )} ~ ${formattedDate(scheduleData?.lecture.lectureEndDate)}`}
            fontSize={13}
          />
        </View>
        <RotatingContainer
          onPress={onPressLectureArrow}
          style={styles.rotatingContainer}
          duration={350}>
          <SvgIcon name="DropDownArrow" />
        </RotatingContainer>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.placeInfo}>
          <SvgIcon name="MapPoint" size={17} />
          <CText // 강의 장소
            style={{flex: 1}}
            lineBreak
            text={scheduleData?.lecture.lecturePlaceName ?? '-'}
          />
        </View>
        <StatusInfoContainer // 현재 강의 상태 (강의 중, 강의 종료, 강의 예정)
          colorType={scheduleStatus.colorType}
          text={scheduleStatus.text}
        />
      </View>
      {isDetailShown && (
        <BtnSchedule // 입실/퇴실/외출 버튼 + 시간별 출결의 시간 리스트
          scheduleData={scheduleData}
          isBtnAvailable={isBtnAvailable}
          isAllowedAfterEnd={isAllowedAfterEnd}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 7,
    borderRadius: 7,
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  infoContainer: {
    gap: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  placeInfo: {
    gap: 3,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rotatingContainer: {
    paddingLeft: 15,
    paddingTop: 10,
  },
});

export default DaySchedulesLecture;

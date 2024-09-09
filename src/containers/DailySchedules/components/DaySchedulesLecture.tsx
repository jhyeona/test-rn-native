import React from 'react';
import {StyleSheet, View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import BtnSchedule from '#containers/DailySchedules/components/BtnScheduleAttend.tsx';
import DaySchedulesStatus from '#containers/DailySchedules/components/DaySchedulesStatus.tsx';

const DaySchedulesLecture = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={[style, styles.container]}>
      <CText text="강의명" fontSize={16} fontWeight="600" />
      <CText text="2024.10.01 ~ 2025.10.01" fontSize={13} />
      <View style={styles.infoContainer}>
        <View style={styles.placeInfo}>
          <SvgIcon name="MapPoint" size={17} />
          <CText style={{flex: 1}} lineBreak text="강의장소명" />
        </View>
        {/* 강의 예정 : red / 강의중 : blue / 강의 종료 : gray */}
        <DaySchedulesStatus color="blue" text="강의 중" />
      </View>
      {/* 기본 출결 버튼 */}
      <BtnSchedule />
      {/* 시간별 출결일 경우 사용 */}
      <BtnSchedule />
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
});

export default DaySchedulesLecture;

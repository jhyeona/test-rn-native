import React from 'react';
import {Pressable} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

export type ScheduleStatusType = 'isBefore' | 'isNow' | 'isAfter';

const DaySchedulesStatus = ({status}: {status: ScheduleStatusType}) => {
  // 강의 예정 : red / 강의중 : blue / 강의 종료 : gray
  const styleMap = {
    isAfter: {textColor: COLORS.gray, bgc: COLORS.lightGray, text: '강의 종료'},
    isNow: {
      textColor: COLORS.primary,
      bgc: COLORS.primaryLight,
      text: '강의중',
    },
    isBefore: {
      textColor: COLORS.dark.red,
      bgc: COLORS.light.red,
      text: '강의 예정',
    },
  };

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 11,
        backgroundColor: styleMap[status].bgc,
        borderRadius: 7,
      }}>
      <CText
        text={styleMap[status].text}
        color={styleMap[status].textColor}
        fontSize={11}
        fontWeight="700"
      />
    </Pressable>
  );
};

export default DaySchedulesStatus;

import React from 'react';
import {Pressable} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

const DaySchedulesStatus = ({color, text}: {color: string; text: string}) => {
  //TODO: color, text 를 설정할 때 status 값만 받아서 설정하기
  let textColor = 'black';
  let backgroundColor = COLORS.lightGray;

  switch (color) {
    case 'blue':
      textColor = COLORS.primary;
      backgroundColor = COLORS.primaryLight;
      break;
    case 'red':
      textColor = COLORS.dark.red;
      backgroundColor = COLORS.light.red;
      break;
    default:
      break;
  }

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 11,
        backgroundColor: backgroundColor,
        borderRadius: 7,
      }}>
      <CText text={text} color={textColor} fontSize={11} fontWeight="700" />
    </Pressable>
  );
};

export default DaySchedulesStatus;

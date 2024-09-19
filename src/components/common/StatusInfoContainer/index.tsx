import React from 'react';
import {View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

export type ColorType = 'gray' | 'blue' | 'red';

const StatusInfoContainer = ({
  colorType,
  text,
}: {
  colorType: ColorType;
  text: string;
}) => {
  const styleMap = {
    gray: {textColor: COLORS.gray, bgc: COLORS.lightGray},
    blue: {
      textColor: COLORS.primary,
      bgc: COLORS.primaryLight,
    },
    red: {
      textColor: COLORS.dark.red,
      bgc: COLORS.light.red,
    },
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 11,
        backgroundColor: styleMap[colorType].bgc,
        borderRadius: 7,
      }}>
      <CText
        text={text}
        color={styleMap[colorType].textColor}
        fontSize={11}
        fontWeight="700"
      />
    </View>
  );
};

export default StatusInfoContainer;

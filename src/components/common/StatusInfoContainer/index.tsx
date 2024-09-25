import React from 'react';
import {View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {STATUS_STYLE_MAP} from '#constants/common.ts';

export type ColorType = 'gray' | 'blue' | 'red';
interface StatusInfoContainerProps {
  colorType: ColorType | string;
  text: string;
}

const StatusInfoContainer = ({colorType, text}: StatusInfoContainerProps) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 11,
        backgroundColor: STATUS_STYLE_MAP[colorType].bgc,
        borderRadius: 7,
      }}>
      <CText
        text={text}
        color={STATUS_STYLE_MAP[colorType].textColor}
        fontSize={11}
        fontWeight="700"
      />
    </View>
  );
};

export default StatusInfoContainer;

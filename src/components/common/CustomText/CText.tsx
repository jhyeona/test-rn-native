import React from 'react';
import {Text} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import {IS_ANDROID} from '#constants/common.ts';

interface Props {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
  lineBreak?: boolean;
}
const CText = (props: Props) => {
  const {
    text,
    fontSize = 14,
    fontWeight,
    lineHeight,
    color,
    style,
    lineBreak,
  } = props;

  const realFontSize = IS_ANDROID ? fontSize - 1 : fontSize;

  const fontWeightToFontFamily = (weight: string) => {
    let family;
    switch (weight) {
      case '300': {
        family = 'Pretendard-Thin';
        break;
      }
      case '400': {
        family = 'Pretendard-Light';
        break;
      }
      case '500': {
        family = 'Pretendard-Medium';
        break;
      }
      case '600': {
        family = 'Pretendard-SemiBold';
        break;
      }
      case '700': {
        family = 'Pretendard-Bold';
        break;
      }
      case '800': {
        family = 'Pretendard-ExtraBold';
        break;
      }
    }

    return family;
  };
  return (
    <Text
      textBreakStrategy={lineBreak ? 'highQuality' : 'simple'}
      lineBreakStrategyIOS={lineBreak ? 'hangul-word' : 'none'}
      style={[
        style,
        {
          color: color ?? 'black',
          fontSize: realFontSize,
          lineHeight: lineHeight,
          fontFamily: fontWeight
            ? fontWeightToFontFamily(fontWeight)
            : 'Pretendard-Medium',
        },
      ]}>
      {text}
    </Text>
  );
};

export default CText;

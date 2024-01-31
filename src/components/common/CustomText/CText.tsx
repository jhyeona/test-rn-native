import React from 'react';
import {Text} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface Props {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
}
const CText = (props: Props) => {
  const {text, fontSize, fontWeight, lineHeight, color, style} = props;
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
      style={[
        style,
        {
          color: color ?? 'black',
          fontSize: fontSize ?? 14,
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

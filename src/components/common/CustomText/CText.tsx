import React from 'react';
import {Text} from 'react-native';

interface Props {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: '400' | '500' | '600' | '700' | '800';
  lineHeight?: number;
}
const CText = (props: Props) => {
  const {text, fontSize, fontWeight, lineHeight, color} = props;
  return (
    <Text
      style={{
        color: color ?? 'black',
        fontSize: fontSize ?? 14,
        fontWeight: fontWeight ?? '500',
        lineHeight: lineHeight,
      }}>
      {text}
    </Text>
  );
};

export default CText;

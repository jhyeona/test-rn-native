import {COLORS} from '#constants/colors.ts';
import {Pressable} from 'react-native';
import CText from '#components/common/CustomText/CText.tsx';
import React from 'react';

const LightButton = ({color, text}: {color: string; text: string}) => {
  let textColor = 'black';
  let borderColor = 'black';
  let backgroundColor = COLORS.lightGray;

  switch (color) {
    case 'blue':
      textColor = COLORS.primary;
      borderColor = COLORS.primary;
      backgroundColor = COLORS.primaryLight;
      break;
    case 'red':
      textColor = COLORS.dark.red;
      borderColor = COLORS.dark.red;
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
        width: 58,
        height: 24,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: 7,
      }}>
      <CText text={text} fontSize={11} color={textColor} />
    </Pressable>
  );
};

export default LightButton;

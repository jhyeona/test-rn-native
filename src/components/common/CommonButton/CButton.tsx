import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle, ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

interface Props {
  text: string;
  onPress: () => void;
  whiteButton?: boolean;
  disabled?: boolean;
  noMargin?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  fontStyle?: StyleProp<TextStyle>;
  fontSize?: number;
}
const CButton = (props: Props) => {
  const {text, whiteButton, buttonStyle, fontSize, onPress, fontStyle, noMargin, disabled} = props;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        disabled ? styles.disabled : whiteButton ? styles.whiteButton : styles.primaryButton,
        {marginVertical: noMargin ? 0 : 17},
      ]}
      onPress={() => onPress()}
      disabled={disabled}>
      <CText
        style={fontStyle}
        text={text}
        fontWeight="700"
        fontSize={fontSize ?? 16}
        color={disabled ? COLORS.gray : whiteButton ? COLORS.primary : 'white'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  whiteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.layout,
  },
});

export default CButton;

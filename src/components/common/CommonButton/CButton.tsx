import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors.ts';
import CText from '../CustomText/CText.tsx';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {
  TextStyle,
  ViewStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

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
  const {
    text,
    whiteButton,
    buttonStyle,
    fontSize,
    onPress,
    fontStyle,
    noMargin,
    disabled,
  } = props;
  return (
    <Pressable
      style={[
        styles.button,
        buttonStyle,
        disabled
          ? styles.disabled
          : whiteButton
            ? styles.whiteButton
            : styles.primaryButton,
        {marginVertical: noMargin ? 0 : 17},
      ]}
      onPress={() => onPress()}
      disabled={disabled}>
      <CText
        style={fontStyle}
        text={text}
        fontWeight="600"
        fontSize={fontSize ?? 16}
        color={disabled ? COLORS.gray : whiteButton ? COLORS.primary : 'white'}
      />
    </Pressable>
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

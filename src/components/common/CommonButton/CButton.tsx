import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../../constants/colors.ts';
import CText from '../CustomText/CText.tsx';

interface Props {
  text: string;
  onPress: () => void;
  whiteButton?: boolean;
  disabled?: boolean;
}
const CButton = (props: Props) => {
  const {text, whiteButton, onPress, disabled} = props;
  return (
    <Pressable
      style={[
        styles.button,
        whiteButton ? styles.whiteButton : styles.primaryButton,
      ]}
      onPress={() => onPress()}
      disabled={disabled}>
      <CText
        text={text}
        fontWeight="600"
        fontSize={16}
        color={whiteButton ? COLORS.primary : 'white'}
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
    marginVertical: 17,
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
});

export default CButton;

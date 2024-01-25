import React, {ReactNode} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import CheckIcon from './CheckIcon.tsx';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';

export interface Props {
  isChecked: boolean;
  isCircle?: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  labelMessage?: string;
  // style?: ViewStyle;
  children?: ReactNode;
}

const Checkbox = (props: Props) => {
  const {
    isChecked,
    isCircle,
    disabled,
    onValueChangeHandler,
    labelMessage,
    children,
  } = props;
  const triggerCheckbox = () => {
    if (!disabled) {
      onPressedHandler();
    }
  };

  const onPressedHandler = () => {
    onValueChangeHandler(!isChecked);
  };

  return (
    <View style={[styles.container]}>
      <Pressable
        disabled={disabled}
        onPress={onPressedHandler}
        style={[
          styles.checkbox,
          isCircle ? styles.checkboxCircle : styles.checkboxSquare,
          isChecked && styles.checked,
          disabled && styles.disabled,
          isChecked && disabled && styles.checkedAndDisabled,
        ]}>
        {isChecked && (
          <CheckIcon size={16} color={disabled ? 'black' : 'white'} isCircle />
        )}
      </Pressable>
      <View style={styles.labelContainer}>
        <Pressable style={styles.label} onPress={triggerCheckbox}>
          <CText text={labelMessage ?? ''} fontWeight="400" fontSize={12} />
        </Pressable>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: COLORS.layout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquare: {
    borderRadius: 3,
  },
  checkboxCircle: {
    borderRadius: 10,
  },
  checked: {
    backgroundColor: 'green',
    borderColor: 'red',
  },
  disabled: {
    borderColor: 'blue',
    backgroundColor: 'blue',
  },
  checkedAndDisabled: {
    backgroundColor: 'grey',
    borderColor: 'grey',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
});
export default Checkbox;

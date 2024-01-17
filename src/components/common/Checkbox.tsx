import React from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import Check from './Check.tsx';
import {checkboxProps} from '../../types/common.ts';

const Checkbox = (props: checkboxProps) => {
  const {isChecked, disabled, onValueChangeHandler, labelMessage} = props;
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
          isChecked && styles.checked,
          disabled && styles.disabled,
          isChecked && disabled && styles.checkedAndDisabled,
        ]}>
        {isChecked && <Check size={16} color={disabled ? 'black' : 'white'} />}
      </Pressable>
      <Pressable style={styles.label} onPress={triggerCheckbox}>
        <Text>{labelMessage}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: -1,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  disabled: {
    borderColor: 'blue',
    backgroundColor: 'blue',
  },
  checkedAndDisabled: {
    backgroundColor: 'grey',
    borderColor: 'grey',
  },
  label: {
    marginLeft: 8,
  },
});
export default Checkbox;

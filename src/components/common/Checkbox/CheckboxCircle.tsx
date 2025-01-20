import React, {ReactNode} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';

import SvgIcon from '#components/common/Icon/Icon.tsx';

export interface Props {
  isChecked: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  labelMessage?: string;
  circleSize?: number;
  children?: ReactNode;
}

const Checkbox = (props: Props) => {
  const {isChecked, disabled, onValueChangeHandler, circleSize, children} =
    props;

  const onPressedHandler = () => {
    onValueChangeHandler(!isChecked);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressedHandler}
      style={[styles.container]}>
      {isChecked ? (
        <SvgIcon
          name="CheckboxCircleOn"
          size={circleSize ? circleSize + 8 : 18}
        />
      ) : (
        <SvgIcon
          name="CheckboxCircleOff"
          size={circleSize ? circleSize + 8 : 18}
        />
      )}
      <View style={styles.labelContainer}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  labelContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
export default Checkbox;

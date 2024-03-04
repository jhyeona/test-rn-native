import React, {ReactNode} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import CText from '#components/common/CustomText/CText.tsx';

export interface Props {
  isChecked: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  labelMessage?: string;
  fontSize?: number;
  children?: ReactNode;
}

const Checkbox = (props: Props) => {
  const {
    isChecked,
    disabled,
    onValueChangeHandler,
    fontSize,
    labelMessage,
    children,
  } = props;

  const onPressedHandler = () => {
    onValueChangeHandler(!isChecked);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressedHandler}
      style={[styles.container]}>
      {isChecked ? (
        <SvgIcon name="CheckboxCircleOn" size={fontSize ? fontSize + 8 : 18} />
      ) : (
        <SvgIcon name="CheckboxCircleOff" size={fontSize ? fontSize + 8 : 18} />
      )}
      <View style={styles.labelContainer}>
        <CText text={labelMessage ?? ''} fontSize={fontSize ?? 14} lineBreak />
        {children}
      </View>
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

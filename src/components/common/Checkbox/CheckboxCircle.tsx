import React, {ReactNode} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import SvgIcon from '../../../components/common/Icon/Icon.tsx';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';

export interface Props {
  isChecked: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  labelMessage?: string;
  fontSize?: number;
  children?: ReactNode;
}

const Checkbox = (props: Props) => {
  const {isChecked, disabled, onValueChangeHandler, labelMessage, children} =
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
        <SvgIcon name="CheckboxOn" size={18} />
      ) : (
        <SvgIcon name="CheckboxOff" size={18} />
      )}
      <View style={styles.labelContainer}>
        <CText text={labelMessage ?? ''} fontWeight="400" fontSize={12} />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});
export default Checkbox;

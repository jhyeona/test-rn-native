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
  bold?: boolean;
}

const Checkbox = (props: Props) => {
  const {
    isChecked,
    fontSize,
    bold,
    disabled,
    onValueChangeHandler,
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
        <SvgIcon name="CheckboxOn" size={18} />
      ) : (
        <SvgIcon name="CheckboxOff" size={18} />
      )}
      <View style={styles.labelContainer}>
        <CText
          text={labelMessage ?? ''}
          fontWeight={bold ? '700' : '400'}
          fontSize={fontSize ?? 12}
        />
      </View>
      {children}
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

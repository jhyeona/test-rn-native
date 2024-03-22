import React from 'react';
import {Pressable} from 'react-native';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface MenuButtonProps {
  buttonName: string;
  onPressHandler: () => void;
  buttonStyle: StyleProp<ViewStyle>;
}

const MenuButton = (props: MenuButtonProps) => {
  const {buttonName, onPressHandler, buttonStyle} = props;
  return (
    <Pressable style={buttonStyle} onPress={onPressHandler}>
      <CText text={buttonName} fontSize={20} />
      <SvgIcon name="RightArrow" size={24} />
    </Pressable>
  );
};

export default MenuButton;

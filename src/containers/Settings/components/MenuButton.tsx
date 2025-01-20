import React from 'react';
import {Pressable} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {styles} from '#containers/Settings/styles';

interface MenuButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
}

const MenuButton = (props: MenuButtonProps) => {
  const {title, onPress, buttonStyle} = props;
  return (
    <Pressable style={[styles.containerRow, buttonStyle]} onPress={onPress}>
      <CText text={title} fontSize={20} />
      <SvgIcon name="RightArrow" size={24} />
    </Pressable>
  );
};

export default MenuButton;

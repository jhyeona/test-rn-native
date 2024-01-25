import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import SvgIcon from '../Icon/Icon.tsx';
import {LeftArrow} from '../../../assets/svg';

interface Props {
  title: string;
  isBack?: boolean;
  navigation?: BottomTabNavigationHelpers;
}

const Header = (props: Props) => {
  const {title, isBack = false, navigation} = props;

  const onPressGoBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      {isBack && (
        <Pressable style={styles.icon} onPress={onPressGoBack}>
          <SvgIcon name="LeftArrow" size={20} />
        </Pressable>
      )}
      <CText text={title} fontWeight="700" fontSize={22} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  icon: {
    marginRight: 10,
  },
});

export default Header;

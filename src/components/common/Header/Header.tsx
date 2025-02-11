import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

interface Props {
  title: string;
  isBack?: boolean;
  rightChildren?: React.ReactNode;
  navigation?: NativeStackNavigationHelpers;
}

const Header = (props: Props) => {
  const {title, isBack = false, rightChildren, navigation} = props;

  const onPressGoBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      {isBack ? (
        <Pressable style={styles.icon} onPress={onPressGoBack}>
          <SvgIcon name="LeftArrow" size={20} />
          <CText
            text={title}
            fontWeight="700"
            fontSize={22}
            style={{marginLeft: 15}}
          />
        </Pressable>
      ) : (
        <CText text={title} fontWeight="700" fontSize={22} />
      )}
      {rightChildren}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default Header;

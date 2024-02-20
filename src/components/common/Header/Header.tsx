import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';
import SvgIcon from '../Icon/Icon.tsx';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

interface Props {
  title: string;
  isBack?: boolean;
  navigation?: NativeStackNavigationHelpers;
}

const Header = (props: Props) => {
  const {title, isBack = false, navigation} = props;

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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default Header;

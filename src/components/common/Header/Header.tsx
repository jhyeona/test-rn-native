import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

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
        <Pressable style={styles.arrowContainer} onPress={onPressGoBack}>
          <View style={styles.arrow} />
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
  arrowContainer: {
    marginRight: 10,
    width: 14,
    height: 14,
  },
  arrow: {
    flex: 1,
    transform: [{rotate: '-45deg'}],
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    // borderRadius: 4,
    borderColor: COLORS.gray,
  },
});

export default Header;

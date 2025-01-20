import {Pressable, StyleSheet} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import DraggableFAB from '#components/common/Animation/Floator.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {BOX_SHADOW, COLORS} from '#constants/colors.ts';

const BtnReasonList = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  return (
    <DraggableFAB>
      <Pressable
        onPress={() => {
          navigation.navigate('ReasonStatement');
        }}
        style={styles.btnReason}>
        <SvgIcon name="Notepad" />
        <CText text="사유서" color={COLORS.lightGray} />
      </Pressable>
    </DraggableFAB>
  );
};

const styles = StyleSheet.create({
  btnReason: {
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    ...BOX_SHADOW,
  },
});

export default BtnReasonList;

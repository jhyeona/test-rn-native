import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useQueryClient} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import SettingButtonsModal from '#containers/Academy/components/SettingButtonsModal.tsx';
import {NoAcademyProps} from '#containers/Academy/types';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import GlobalState from '#recoil/Global';

export const policyTitle = '약관 및 계정 관리';

const NoAcademy = ({prevScreenName, navigation}: NoAcademyProps) => {
  const queryClient = useQueryClient();

  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);

  const [isVisible, setVisible] = useState(false);

  const onPressLogout = () => {
    handleLogout({setGlobalModalState, setIsLogin});
    queryClient.clear();
  };

  return (
    <>
      <View style={styles.container}>
        <CText text="초대 받은 기관이 없어요." fontSize={16} fontWeight="600" />
        <View style={styles.imgWrapper}>
          <SvgIcon name="Invite" />
        </View>
        {!prevScreenName && (
          <>
            <CButton whiteButton text="로그아웃" onPress={onPressLogout} />
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.bottomButton}>
              <CText text={policyTitle} color={COLORS.placeholder} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <SettingButtonsModal
        isVisible={isVisible}
        onPressCancel={setVisible}
        navigation={navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  imgWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    alignSelf: 'center',
  },
});

export default NoAcademy;

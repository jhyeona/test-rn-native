import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {RESULTS} from 'react-native-permissions';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import Toggle from '#components/common/Toggle/Toggle.tsx';
import MenuButton from '#components/Mypage/MenuButton.tsx';
import {COLORS} from '#constants/colors.ts';
import {APP_VERSION} from '#constants/common.ts';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import {patchUpdatePush} from '#hooks/useMypage.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import userState from '#recoil/User';
import {
  handleOpenSettings,
  requestNotificationsPermission,
} from '#utils/permissionsHelper.ts';

const Settings = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const {userData, refetchUserData} = useGetUserInfo();
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const [isPushApp, setIsPushApp] = useState(
    userData ? userData?.settingPushApp : true,
  );
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setUserData = useSetRecoilState(userState.userInfoState);
  const [isPushToggleDisabled, setIsPushToggleDisabled] = useState(false);

  const onPressUpdatePassword = () => {
    navigation.navigate('UpdatePassword');
  };

  const onPressChangeAcademy = () => {
    navigation.navigate('SelectAcademy');
  };

  const onPressPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const onPressLogout = () => {
    handleLogout({setGlobalModalState, setUserData, setIsLogin});
  };

  const onPressWithdraw = () => {
    navigation.navigate('UserWithdraw');
  };

  useEffect(() => {
    (async () => {
      setIsPushToggleDisabled(true);
      if (isPushApp) {
        const notificationResult = await requestNotificationsPermission();
        if (
          notificationResult === RESULTS.BLOCKED ||
          notificationResult === RESULTS.DENIED
        ) {
          await patchUpdatePush({settingPushApp: false});
          setIsPushApp(false);
          setGlobalModalState({
            isVisible: true,
            title: '권한 설정 안내',
            message: `알림 설정을 위해 알림 권한이 필요합니다. \n확인을 누르면 설정으로 이동합니다.`,
            isConfirm: true,
            onPressConfirm: () => handleOpenSettings(),
          });
          return;
        }
      }
      if (userData?.settingPushApp !== isPushApp) {
        await patchUpdatePush({settingPushApp: isPushApp});
      }
      setTimeout(() => {
        setIsPushToggleDisabled(false);
        refetchUserData().then();
      }, 400);
    })();
  }, [
    isPushApp,
    setGlobalModalState,
    userData?.settingPushApp,
    refetchUserData,
  ]);

  return (
    <CSafeAreaView>
      <Header title="설정" />
      <ScrollView>
        <View
          style={[
            styles.containerRow,
            {
              paddingBottom: 16,
            },
          ]}>
          <CText text="PUSH 알림 설정" fontSize={20} fontWeight="500" />
          <Toggle
            isActive={isPushApp}
            onToggle={setIsPushApp}
            disabled={isPushToggleDisabled}
          />
        </View>
        <MenuButton
          buttonStyle={styles.containerRow}
          buttonName="비밀번호 변경"
          onPressHandler={onPressUpdatePassword}
        />
        <MenuButton
          buttonStyle={styles.containerRow}
          buttonName="기관 설정"
          onPressHandler={onPressChangeAcademy}
        />
        <MenuButton
          buttonStyle={styles.containerRow}
          buttonName="개인정보처리방침"
          onPressHandler={onPressPrivacyPolicy}
        />
        <MenuButton
          buttonStyle={styles.containerRow}
          buttonName="로그아웃"
          onPressHandler={onPressLogout}
        />
        <MenuButton
          buttonStyle={styles.containerRow}
          buttonName="회원탈퇴"
          onPressHandler={onPressWithdraw}
        />
      </ScrollView>
      <CText
        fontSize={12}
        text={`체크히어 v${APP_VERSION}`}
        style={styles.version}
        color={COLORS.placeholder}
      />
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  version: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Settings;

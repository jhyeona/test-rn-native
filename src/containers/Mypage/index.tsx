import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {storage} from '../../utils/storageHelper.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {patchUpdatePush} from '../../hooks/useMypage.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import CText from '../../components/common/CustomText/CText.tsx';
import Toggle from '../../components/common/Toggle/Toggle.tsx';
import {COLORS} from '../../constants/colors.ts';
import SvgIcon from '../../components/common/Icon/Icon.tsx';
import {
  handleOpenSettings,
  requestNotificationsPermission,
} from '../../utils/permissionsHelper.ts';
import {RESULTS} from 'react-native-permissions';
import {useGetUserInfo} from '../../hooks/useUser.ts';

const Mypage = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const {data: userData, refetch: refetchUserData} = useGetUserInfo();
  const setGlobalModalState = useSetRecoilState(globalState.globalModalState);

  const [isPushApp, setIsPushApp] = useState(
    userData ? userData?.settingPushApp : true,
  );
  const setIsLogin = useSetRecoilState(globalState.isLoginState);
  const [isPushToggleDisabled, setIsPushToggleDisabled] = useState(false);

  const onPressUpdatePassword = () => {
    navigation.navigate('UpdatePassword');
  };

  const onPressChangeAcademy = () => {
    navigation.navigate('Academy');
  };

  const onPressPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const onPressLogout = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '로그아웃하시겠습니까?',
      isConfirm: true,
      onPressConfirm: () => {
        setIsLogin(false);
        storage.delete('access_token');
        storage.delete('refresh_token');
      },
    });
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
      }, 400);
    })();
  }, [isPushApp, setGlobalModalState, userData?.settingPushApp]);

  useEffect(() => {
    refetchUserData().then();
  }, [refetchUserData]);

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
        <Pressable style={styles.containerRow} onPress={onPressUpdatePassword}>
          <CText text="비밀번호 변경" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        <Pressable style={styles.containerRow} onPress={onPressChangeAcademy}>
          <CText text="기관변경" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        <Pressable style={styles.containerRow} onPress={onPressPrivacyPolicy}>
          <CText text="개인정보처리방침" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        <Pressable style={styles.containerRow} onPress={onPressLogout}>
          <CText text="로그아웃" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        <Pressable style={styles.containerRow} onPress={onPressWithdraw}>
          <CText text="회원탈퇴" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
      </ScrollView>
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
});

export default Mypage;

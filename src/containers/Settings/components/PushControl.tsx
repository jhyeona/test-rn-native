import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {RESULTS} from 'react-native-permissions';

import {useSetRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import Toggle from '#components/common/Toggle/Toggle.tsx';
import {useUpdatePush} from '#containers/Settings/hooks/useApi.ts';
import {styles} from '#containers/Settings/styles';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import {handleOpenSettings, requestNotificationsPermission} from '#utils/permissionsHelper.ts';

const PushControl = () => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const {userData, refetchUserData} = useGetUserInfo();

  const [isPushToggleDisabled, setIsPushToggleDisabled] = useState(false);
  const [isPushApp, setIsPushApp] = useState(userData ? userData?.settingPushApp : true);

  const {updatePush} = useUpdatePush();

  useEffect(() => {
    (async () => {
      setIsPushToggleDisabled(true);
      if (isPushApp) {
        const notificationResult = await requestNotificationsPermission();
        if (notificationResult === RESULTS.BLOCKED || notificationResult === RESULTS.DENIED) {
          await updatePush({settingPushApp: false});
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
        await updatePush({settingPushApp: isPushApp});
      }
      setTimeout(() => {
        setIsPushToggleDisabled(false);
        refetchUserData().then();
      }, 400);
    })();
  }, [isPushApp, setGlobalModalState, userData?.settingPushApp, refetchUserData]);

  return (
    <View style={[styles.containerRow, {paddingBottom: 16}]}>
      <CText text="PUSH 알림 설정" fontSize={20} fontWeight="500" />
      <Toggle isActive={isPushApp} onToggle={setIsPushApp} disabled={isPushToggleDisabled} />
    </View>
  );
};

export default PushControl;

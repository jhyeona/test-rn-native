import Config from 'react-native-config';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useQueryClient} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import {APP_VERSION} from '#constants/common.ts';
import MenuButton from '#containers/Settings/components/MenuButton.tsx';
import Profile from '#containers/Settings/components/Profile.tsx';
import PushControl from '#containers/Settings/components/PushControl.tsx';
import {styles} from '#containers/Settings/styles';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

const Settings = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const queryClient = useQueryClient();
  const {userData, isTester} = useGetUserInfo();

  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const handleNavigate = (page: string) => {
    navigation.navigate(page);
  };

  const onPressLogout = () => {
    handleLogout({setGlobalModalState, setIsLogin});
    queryClient.clear();
  };

  return (
    <CSafeAreaView>
      <Header title="설정" />
      <Profile userData={userData} />
      <CustomScrollView bounces={false}>
        <PushControl />
        <MenuButton title="비밀번호 변경" onPress={() => handleNavigate('UpdatePassword')} />
        <MenuButton title="회원정보 변경 (재인증)" onPress={() => handleNavigate('UpdatePhone')} />
        {!isTester && (
          <MenuButton title="기관 설정" onPress={() => handleNavigate('SelectAcademy')} />
        )}
        <MenuButton title="고객센터" onPress={() => handleNavigate('CustomerService')} />
        <MenuButton title="로그아웃" onPress={onPressLogout} />
        {(Config.ENV === 'development' || Config.ENV === 'appcenter') && (
          <>
            <CText
              text="🐣 FOR DEV"
              fontSize={24}
              style={{paddingHorizontal: 24, paddingVertical: 15}}
              fontWeight="600"
            />
            <MenuButton title="무선 데이터 수집" onPress={() => handleNavigate('GetBeacon')} />
            <MenuButton title="SDK 테스트" onPress={() => handleNavigate('SdkTest')} />
          </>
        )}
      </CustomScrollView>
      <CText
        fontSize={12}
        text={`여기여기붙어라 v${APP_VERSION}`}
        style={styles.version}
        color={COLORS.placeholder}
      />
    </CSafeAreaView>
  );
};

export default Settings;

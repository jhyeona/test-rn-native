import {ScrollView} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import {APP_VERSION} from '#constants/common.ts';
import MenuButton from '#containers/Settings/components/MenuButton.tsx';
import PushControl from '#containers/Settings/components/PushControl.tsx';
import {styles} from '#containers/Settings/styles';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import GlobalState from '#recoil/Global';

const Settings = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const handleNavigate = (page: string) => {
    navigation.navigate(page);
  };

  const onPressLogout = () => {
    handleLogout({setGlobalModalState, setIsLogin});
  };

  return (
    <CSafeAreaView>
      <Header title="설정" />
      <ScrollView>
        <PushControl />
        <MenuButton title="비밀번호 변경" onPress={() => handleNavigate('UpdatePassword')} />
        <MenuButton title="기관 설정" onPress={() => handleNavigate('SelectAcademy')} />
        <MenuButton title="개인정보처리방침" onPress={() => handleNavigate('PrivacyPolicy')} />
        <MenuButton title="로그아웃" onPress={onPressLogout} />
        <MenuButton title="회원탈퇴" onPress={() => handleNavigate('UserWithdraw')} />
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

export default Settings;

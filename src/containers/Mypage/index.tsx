import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {storage} from '../../utils/storageHelper.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {patchUserUpdate} from '../../hooks/useMypage.ts';
import {checkPassword} from '../../utils/regExpHelper.ts';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import userState from '../../recoil/user';
import globalState from '../../recoil/Global';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import CText from '../../components/common/CustomText/CText.tsx';
import Toggle from '../../components/common/Toggle/Toggle.tsx';
import {COLORS} from '../../constants/colors.ts';
import CInput from '../../components/common/CustomInput/CInput.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import SvgIcon from '../../components/common/Icon/Icon.tsx';
import {useGetUserInfo} from '../../hooks/useUser.ts';

const Mypage = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const [isPushApp, setIsPushApp] = useState(
    userData ? userData?.settingPushApp : true,
  );
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(true);
  const setIsLogin = useSetRecoilState(globalState.isLoginState);

  const onPressUpdate = async () => {
    // if (!isSamePassword || !checkPassword(password)) {
    //   Alert.alert('비밀번호를 확인해주세요.');
    //   return;
    // }
    let data: {settingPushApp: boolean; password?: string} = {
      settingPushApp: isPushApp,
    };
    if (password) {
      data = {...data, password: password};
    }
    try {
      await patchUserUpdate(data);
      Alert.alert('정보가 변경되었습니다.');
      setPassword('');
      setRePassword('');
    } catch (error) {
      console.log('[ERROR]', error);
    }
  };

  const onPressChangeAcademy = () => {
    navigation.navigate('Academy');
  };

  const onPressLogout = () => {
    setIsLogin(false);
    storage.delete('access_token');
    storage.delete('refresh_token');
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword;
    setIsSamePassword(isSame);
  }, [password, rePassword]);

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
          <Toggle isActive={isPushApp} onToggle={setIsPushApp} />
        </View>
        <View style={styles.container}>
          <CInput
            title=""
            inputValue={password}
            setInputValue={setPassword}
            placeholder="영문, 숫자 혼합 8자리 이상"
            fontSize={16}
            secureTextEntry>
            <CText text="비밀번호 변경" fontSize={20} />
          </CInput>
          <CInput
            title=""
            inputValue={rePassword}
            setInputValue={setRePassword}
            placeholder="한 번 더 입력해주세요."
            fontSize={16}
            secureTextEntry>
            <CText text="비밀번호 변경 확인" fontSize={20} />
          </CInput>
          <CButton text="변경 사항 저장" onPress={onPressUpdate} noMargin />
        </View>
        <Pressable style={styles.containerRow} onPress={onPressChangeAcademy}>
          <CText text="기관변경" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        <Pressable style={styles.containerRow} onPress={onPressLogout}>
          <CText text="로그아웃" fontSize={20} />
          <SvgIcon name="RightArrow" size={24} />
        </Pressable>
        {/*<Pressable style={styles.containerRow} onPress={}>*/}
        {/*  <CText text="회원탈퇴" fontSize={20} />*/}
        {/*  <SvgIcon name="RightArrow" size={24} />*/}
        {/*</Pressable>*/}
      </ScrollView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
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

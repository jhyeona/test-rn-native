import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {useSetRecoilState} from 'recoil';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {postGetToken} from '#hooks/useSignIn.ts';
import globalState from '#recoil/Global';
import {storage} from '#utils/storageHelper.ts';
import CText from '#components/common/CustomText/CText.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import {COLORS} from '#constants/colors.ts';

const SignIn = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isIdWarning, setIsIdWarning] = useState(false);
  const [isPasswordWarning, setIsPasswordWarning] = useState(false);
  const setIsLogin = useSetRecoilState(globalState.isLoginState);

  const onChangeId = (value: string) => {
    setId(value);
    if (value) {
      setIsIdWarning(false);
      setIsPasswordWarning(false);
      return;
    }
  };
  const onChangePassword = (value: string) => {
    setPassword(value);
    if (value) {
      setIsIdWarning(false);
      setIsPasswordWarning(false);
      return;
    }
  };

  const onPressSignIn = async () => {
    // 로그인
    Keyboard.dismiss();

    // warning 초기화
    setIsIdWarning(false);
    setIsPasswordWarning(false);

    if (!id) {
      setIsIdWarning(true);
      return;
    }
    if (!password) {
      setIsPasswordWarning(true);
      return;
    }

    const payload = {phone: id, password: password};
    try {
      const response = await postGetToken(payload);
      if (response) {
        storage.set('access_token', response.access_token);
        storage.set('refresh_token', response.refresh_token);
      }
      setIsLogin(true);
    } catch (error: any) {
      if (error.code === '4000') {
        setIsIdWarning(true);
        setIsPasswordWarning(true);
        return;
      }
      Alert.alert(`로그인에 실패하였습니다.`);
    }
  };

  const handlePage = (pageName: string) => {
    // 네비게이션 이동
    navigation.navigate(pageName);
  };

  useEffect(() => {
    // 스토리지에 아이디 있으면 불러오기
    const storagePhone = storage.getString('user_phone');
    if (storagePhone) setId(storagePhone);
  }, []);

  return (
    <CSafeAreaView>
      <CView>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.logo}>
            <CText
              text="통합 출결 관리 서비스"
              fontSize={20}
              fontWeight="600"
            />
            <CText text="체크히어" fontSize={40} fontWeight="800" />
            {(Config.ENV === 'development' || Config.ENV === 'appcenter') && (
              <Pressable
                onPress={() => Alert.alert(`baseURL:${Config.BASE_URL}`)}>
                <CText text={`${Config.ENV}`} />
              </Pressable>
            )}
          </View>
          <View style={styles.textInputWrap}>
            <CInput
              title="휴대폰 번호"
              inputValue={id}
              setInputValue={onChangeId}
              isWarning={isIdWarning}
              errorMessage="올바른 휴대폰 번호를 입력해 주세요."
            />
            <CInput
              title="비밀번호"
              inputValue={password}
              setInputValue={onChangePassword}
              isWarning={isPasswordWarning}
              errorMessage="올바른 비밀번호를 입력해 주세요."
              secureTextEntry
            />
            <CButton text="로그인하기" onPress={onPressSignIn} />
          </View>
          <View style={styles.footerTextContainer}>
            <TouchableOpacity
              style={styles.footerText}
              onPress={() => handlePage('SignUp')}>
              <CText text="회원가입" fontSize={12} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerText}
              onPress={() => handlePage('FindPassword')}>
              <CText text="비밀번호 재발급" fontSize={12} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 100,
    marginBottom: 43,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInputWrap: {
    width: '100%',
    alignItems: 'center',
  },
  footerTextContainer: {
    flexDirection: 'row',
  },
  footerText: {
    paddingHorizontal: 10,
  },
});

export default SignIn;

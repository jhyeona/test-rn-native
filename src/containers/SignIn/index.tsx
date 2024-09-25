import React, {useState} from 'react';
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

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {useSignIn} from '#containers/SignIn/hooks/useApi.ts';
import {errorToCrashlytics, logToCrashlytics} from '#services/firebase.ts';
import {getDeviceUUID} from '#utils/common.ts';

const SignIn = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isIdWarning, setIsIdWarning] = useState(false);
  const [isPasswordWarning, setIsPasswordWarning] = useState(false);

  const {signIn} = useSignIn();

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

    if (!id || !password) {
      !id && setIsIdWarning(true);
      !password && setIsPasswordWarning(true);
      return;
    }

    try {
      const deviceId = await getDeviceUUID();
      await signIn({phone: id, password, deviceInfo: deviceId});
    } catch (error) {
      logToCrashlytics('user login');
      errorToCrashlytics(error, 'requestGetTokenError');
    }
  };

  const handlePage = (pageName: string) => {
    // 네비게이션 이동
    navigation.navigate(pageName);
  };

  return (
    <CSafeAreaView>
      <CView isInput>
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
              inputMode="numeric"
              maxLength={11}
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

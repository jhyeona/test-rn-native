import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import axios from 'axios';
import Checkbox from '../../components/common/Checkbox.tsx';
import {postGetToken} from '../../hooks/useSignIn.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import {storage} from '../../utils/storageHelper.ts';

const SignIn = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const setIsLogin = useSetRecoilState(globalState.isLoginState);

  const onValueChangeHandler = (checked: boolean) => {
    setIsChecked(checked);
  };
  const onPressSignIn = async () => {
    // 로그인
    Keyboard.dismiss();

    if (!id) {
      Alert.alert('아이디(휴대폰 번호)를 입력하세요.');
      return;
    }
    if (!password) {
      Alert.alert('비밀번호를 입력하세요.');
      return;
    }
    const args = {
      data: {phone: id, password: password},
    };
    try {
      // const response = await postGetToken(args);
      await postGetToken(args);

      // storage.set('access_token', response.access_token);
      // storage.set('refresh_token', response.refresh_token);
      // setIsLogin(true);
      // if (isChecked) {
      //   storage.set('user_phone', id);
      // }

      // handlePage('Root');
    } catch (error) {
      console.log('ERROR,', error);
      // if (axios.isAxiosError<any>(error)) {
      //   console.log('[ERROR]', error?.response?.data.message);
      //   Alert.alert('아이디와 비밀번호를 확인하세요.');
      // }
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
    <SafeAreaView>
      <KeyboardAvoidingView style={styles.container}>
        <Text>로그인페이지</Text>
        <View style={styles.textInputWrap}>
          <TextInput
            style={styles.textInput}
            value={id}
            onChangeText={setId}
            placeholder="아이디(휴대폰 번호)를 입력하세요."
            maxLength={11}
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요."
            secureTextEntry
          />
          <Checkbox
            isChecked={isChecked}
            disabled={false}
            onValueChangeHandler={onValueChangeHandler}
            labelMessage={'아이디 기억하기'}
          />
          <TouchableOpacity
            onPress={() => onPressSignIn()}
            style={styles.button}>
            <Text style={styles.textWhite}>로그인</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handlePage('SignUp')}
          style={styles.button}>
          <Text style={styles.textWhite}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePage('FindPassword')}
          style={styles.button}>
          <Text style={styles.textWhite}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrap: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 10,
    padding: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: 'grey',
  },
  button: {
    marginTop: 10,
    padding: 10,
    width: '50%',
    backgroundColor: 'navy',
    alignItems: 'center',
  },
  textWhite: {
    color: 'white',
  },
});

export default SignIn;

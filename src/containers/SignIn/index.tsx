import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const SignIn = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (pageName: string) => {
    navigation.navigate(pageName);
  };

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
          <TouchableOpacity
            onPress={() => handleLogin('Root')}
            style={styles.button}>
            <Text style={styles.textWhite}>로그인</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleLogin('SignUp')}
          style={styles.button}>
          <Text style={styles.textWhite}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLogin('FindPassword')}
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

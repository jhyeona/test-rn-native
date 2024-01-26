import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {storage} from '../../utils/storageHelper.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {patchUserUpdate} from '../../hooks/useMypage.ts';
import {checkPassword} from '../../utils/regExpHelper.ts';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import userState from '../../recoil/user';
import globalState from '../../recoil/Global';

const Mypage = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const [isPushApp, setIsPushApp] = useState(
    userData ? userData?.settingPushApp : true,
  );
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(true);
  const setIsLogin = useSetRecoilState(globalState.isLoginState);
  const toggleSwitch = () => setIsPushApp(previousState => !previousState);

  const onPressUpdate = async () => {
    if (!isSamePassword) {
      if (!checkPassword(password))
        Alert.alert('비밀번호는 영문 숫자 혼합 8자리 이상이어야 합니다.');
      Alert.alert('비밀번호를 확인해주세요.');
      return;
    }
    let data: {settingPushApp: boolean; password?: string} = {
      settingPushApp: isPushApp,
    };
    if (password) {
      data = {...data, password: password};
    }

    const args = {data};

    try {
      await patchUserUpdate(args);
      Alert.alert('정보가 변경되었습니다.');
      // TODO: 변경된 정보 상태 관리;
    } catch (error) {
      console.log('[ERROR]', error);
    }
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

  //TODO: password 입력 -> component
  return (
    <SafeAreaView>
      <Text>설정</Text>
      <ScrollView bounces={false}>
        <View style={styles.viewContainer}>
          <Text>PUSH 알림 설정</Text>
          <Text style={styles.textInput}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isPushApp ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isPushApp}
            />
          </Text>
        </View>
        <View style={styles.viewContainer}>
          <Text>비밀번호 변경</Text>
          <TextInput
            style={styles.textInput}
            placeholder="영문, 숫자 혼합 8자리 이상"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.viewContainer}>
          <Text>비밀번호 변경 확인</Text>
          <TextInput
            style={styles.textInput}
            placeholder="한번 더 입력하세요."
            value={rePassword}
            onChangeText={setRePassword}
          />
        </View>
        {isSamePassword ? (
          ''
        ) : (
          <Text style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</Text>
        )}
        <Pressable style={styles.press} onPress={onPressUpdate}>
          <Text>변경 사항 저장</Text>
        </Pressable>
        <Pressable style={styles.press} onPress={onPressLogout}>
          <Text>로그아웃</Text>
        </Pressable>
        <Pressable style={styles.press}>
          <Text>회원탈퇴</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: '60%',
  },
  press: {
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default Mypage;

import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkPassword,
  checkName,
  checkPhone,
} from '../../utils/regExpHelper.ts';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import {postSignUpPhone} from '../../hooks/useSignUp.ts';
import axios from 'axios';
import {apiResponse} from '../../types/common.ts';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [phone, setPhone] = useState('');
  const [isDoubleCheckPhone, setIsDoubleCheckPhone] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [smsId, setSmsId] = useState('');
  const [isSms, setIsSmsId] = useState(false);
  const [isSmsCompleted, setIsSmsCompleted] = useState(false);
  const [samePassword, setSamePassword] = useState(true);
  const [isPicker, setIsPicker] = useState(false);
  const refInput = useRef<TextInput>(null);

  const doubleCheckPhone = async () => {
    // 휴대폰 번호 중복 확인
    if (!checkPhone(phone)) {
      Alert.alert('올바른 휴대폰 번호를 입력하세요.');
      refInput?.current?.focus();
      return;
    }
    const args = {
      url: 'http://192.168.219.184:8081/api/v3/user/signup/phone',
      data: {phone: phone},
    };
    try {
      await postSignUpPhone(args);
      setIsDoubleCheckPhone(true);
    } catch (error) {
      if (axios.isAxiosError<apiResponse, any>(error)) {
        console.log('e', error?.response?.data.message);
      }
    }
  };

  const handleSendSms = () => {
    // SMS 인증 번호 발송
    //TODO - SMS 인증 요청 API
    setIsSmsId(true);
  };

  const confirmSms = () => {
    // SMS 인증 완료
    if (!smsId) {
      Alert.alert('인증 번호를 입력하세요.');
      return;
    }
    //TODO - SMS 인증 완료 API
    setIsSmsCompleted(true);
  };

  const handleSignUp = () => {
    // 회원가입 진행
    // const params = {
    //   phone: phone,
    //   smsId: smsId,
    //   password: password,
    //   name: name,
    // };
    if (!name) {
      Alert.alert('이름을 입력해 주세요.');
      return;
    }
    if (!checkName(name)) {
      Alert.alert('이름을 바르게 입력해 주세요.');
      return;
    }
    if (!isSmsCompleted) {
      Alert.alert('휴대폰 인증을 해주세요.');
      return;
    }
    if (!checkPassword(password) || !checkPassword(rePassword)) {
      Alert.alert('비밀번호 형식이 올바르지 않습니다.');
      return;
    }
    Alert.alert('회원가입이 완료되었습니다. 로그인해 주세요.');
    navigation.navigate('SignIn');
  };

  const setDate = (date: Date | undefined) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setBirthday(formattedDate);
    setIsPicker(false);
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword;
    setSamePassword(isSame);
  }, [password, rePassword]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>회원가입</Text>
      <View>
        <TextInput placeholder="이름" value={name} onChangeText={setName} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="휴대폰 번호 (아이디)"
            value={phone}
            onChangeText={setPhone}
            onChange={() => setIsDoubleCheckPhone(false)}
            ref={refInput}
            maxLength={11}
            readOnly={isSms}
          />
          {isDoubleCheckPhone ? (
            !isSms && (
              <TouchableOpacity
                onPress={handleSendSms}
                disabled={!isDoubleCheckPhone}>
                <Text>인증번호 발송</Text>
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity onPress={doubleCheckPhone}>
              <Text>중복확인</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="인증번호"
            value={smsId}
            onChangeText={setSmsId}
            maxLength={6}
            readOnly={isSmsCompleted}
          />
          {isSms && !isSmsCompleted ? (
            <TouchableOpacity onPress={confirmSms} disabled={isSmsCompleted}>
              <Text>인증번호 확인</Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>
        <TextInput
          placeholder="비밀번호: 8자리 이상 영문+숫자"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="비밀번호 재입력"
          value={rePassword}
          onChangeText={setRePassword}
          secureTextEntry
        />
        {samePassword ? (
          ''
        ) : (
          <Text style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</Text>
        )}
        <TouchableOpacity onPress={() => setIsPicker(true)}>
          <Text>{birthday ? birthday : '생년월일 (선택)'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignUp}>
        <Text>회원가입</Text>
      </TouchableOpacity>
      {isPicker ? (
        <DateTimePicker
          value={new Date()}
          onChange={(e, date) => setDate(date)}
          display="spinner"
          maximumDate={new Date()}
          timeZoneName={'Asia/Seoul'}
        />
      ) : (
        ''
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
});
export default SignUp;

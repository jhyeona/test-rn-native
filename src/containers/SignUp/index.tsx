import React, {useEffect, useState} from 'react';
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
import {
  postSignUp,
  postSignUpPhone,
  postSignUpSMS,
  postSignUpSMSConfirm,
  postSignUpTAS,
} from '../../hooks/useSignUp.ts';
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

  const doubleCheckPhone = async () => {
    // 휴대폰 번호 중복 확인
    if (!checkPhone(phone)) {
      Alert.alert('올바른 휴대폰 번호를 입력하세요.');
      return;
    }
    const args = {
      data: {phone: phone},
    };
    try {
      await postSignUpPhone(args);
      // setIsDoubleCheckPhone(true);
      Alert.alert('가입 가능한 번호입니다.');
    } catch (error) {
      console.log('error:', error);
      if (axios.isAxiosError<apiResponse, any>(error)) {
        console.log('API Error:', error?.response?.data.message);
      }
    }
  };

  const onPressSendTAS = async () => {
    // TAS + SMS 인증
    if (!isDoubleCheckPhone) {
      Alert.alert('휴대폰 중복 확인을 해주세요.');
      return;
    }
    const args = {
      data: {phone: phone},
    };
    const tasArgs = {
      data: {...args.data, birth: '', phone: '', telecom: ''},
    };

    try {
      const tasResponse = await postSignUpTAS(tasArgs);
      if (tasResponse.status === 200) {
        // tas 요청 성공 시 바로 sms 인증 코드 요청
        await postSignUpSMS(args);
        setIsSmsId(true);
      }
    } catch (error) {
      console.log('[ERROR]', error);
      Alert.alert(`error: ${error}`);
    }
  };

  const confirmSms = async () => {
    // SMS 인증 완료
    if (!smsId) {
      Alert.alert('인증 번호를 입력하세요.');
      return;
    }
    const args = {
      data: {
        phone: phone,
        verifyCode: smsId,
      },
    };
    try {
      await postSignUpSMSConfirm(args);
      setIsSmsCompleted(true);
    } catch (error) {
      console.log('[ERROR]', error);
    }
  };

  const handleSignUp = async () => {
    // 회원가입 진행
    const params = {
      phone: phone,
      name: name,
      birth: moment(birthday).format('YYMMDD'),
      password: password,
    };
    const args = {data: params};
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

    try {
      await postSignUp(args);
      Alert.alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('error', error);
    }
  };

  const setDate = (date: Date | undefined) => {
    // 생년월일 선택
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
            maxLength={11}
            readOnly={isSms}
          />
          {!isDoubleCheckPhone && (
            <TouchableOpacity onPress={doubleCheckPhone}>
              <Text>중복확인</Text>
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          placeholder="이름"
          value={name}
          onChangeText={setName}
          readOnly={isSmsCompleted}
        />
        <TouchableOpacity
          onPress={() => setIsPicker(true)}
          disabled={isSmsCompleted}>
          <Text>{birthday ? birthday : '생년월일'}</Text>
        </TouchableOpacity>
        <View>
          <Text>통신사 선택</Text>
        </View>
        {isSms ? (
          ''
        ) : (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              marginTop: 10,
              backgroundColor: isDoubleCheckPhone ? 'white' : 'grey',
            }}
            onPress={onPressSendTAS}
            disabled={!isDoubleCheckPhone}>
            <Text>인증번호 발송</Text>
          </TouchableOpacity>
        )}
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

import React, {useEffect, useState} from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkName,
  checkPassword,
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
import Dropdown from '../../components/common/Dropdown.tsx';
import {TextInputChangeEventData} from 'react-native/Libraries/Components/TextInput/TextInput';
import Checkbox from '../../components/common/Checkbox.tsx';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [telecom, setTelecom] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isCertification, setIsCertification] = useState(false);
  const [samePassword, setSamePassword] = useState(true);
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
  const [isPicker, setIsPicker] = useState(false);

  const genderList = [
    // 성별 선택 드롭다운
    {label: '남', value: 'M'},
    {label: '여', value: 'F'},
  ];
  const onChangeGenderValue = (value: string) => {
    // 성별 선택
    setGender(value);
  };

  const telecomList = [
    // 통신사 선택 드롭다운
    {label: 'SKT', value: 'SKT'},
    {label: 'KT', value: 'KT'},
    {label: 'LG U+', value: 'LGT'},
  ];

  const onChangeTelecomValue = (value: string) => {
    // 통신사 선택
    setTelecom(value);
  };

  const setDate = (date: Date | undefined) => {
    // 생년월일 선택
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setBirthday(formattedDate);
    setIsPicker(false);
  };

  const onChangePhone = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    // 휴대폰 번호 입력 유효성 체크
    setIsPhone(checkPhone(e.nativeEvent.text));
  };

  const doubleCheckPhone = async () => {
    // 휴대폰 번호 중복 확인
    if (!checkPhone(phone)) {
      Alert.alert('올바른 휴대폰 번호를 입력하세요.');
      return;
    }
    try {
      await postSignUpPhone(phone);
      return true;
    } catch (error) {
      console.log('error:', error);
      if (axios.isAxiosError<apiResponse, any>(error)) {
        console.log('API Error:', error?.response?.data.message);
      }
      return false;
    }
  };

  const tasCertification = async () => {
    // TAS 인증
    const data = {
      phone: phone,
      name: name,
      gender: gender,
      birth: birthday,
      telecom: telecom,
    };

    try {
      return await postSignUpTAS(data);
    } catch (error) {
      console.log('[ERROR]', error);
      // Alert.alert(`error: ${error}`);
      return error;
    }
  };

  const smsCertification = async () => {
    // SMS 인증 요청
    const data = {phone: phone};
    try {
      return await postSignUpSMS(data);
    } catch (e) {
      return e;
    }
  };

  const onPressCertification = async () => {
    // 전체 인증 요청
    if (!name) {
      Alert.alert('이름을 입력해 주세요.');
      return;
    }
    if (!checkName(name)) {
      Alert.alert('이름을 바르게 입력해 주세요.');
      return;
    }
    if (!isPhone) {
      Alert.alert('휴대폰 번호를 바르게 입력하세요.');
      return;
    }
    setIsSend(true);

    const isDoubleCheckPhone = await doubleCheckPhone();
    if (!isDoubleCheckPhone) {
      Alert.alert('이미 사용중인 휴대폰 번호입니다.');
      setIsSend(false);
      return;
    }

    const resultTasCertification = await tasCertification();
    if (resultTasCertification.status === 200) {
      console.log('TAS Success:', resultTasCertification);
    } else {
      console.log('TAS Error:', resultTasCertification);
      return;
    }

    const resultSMS = await smsCertification();
    console.log(resultSMS);
    if (resultSMS.code === '0000') Alert.alert('인증번호가 전송되었습니다.');
  };

  const onPressConfirm = async () => {
    // 휴대폰 인증 완료 버튼 클릭
    if (!smsCode) {
      Alert.alert('인증 번호를 입력하세요.');
      return;
    }
    const data = {
      phone: phone,
      verifyCode: smsCode,
    };

    try {
      await postSignUpSMSConfirm(data);
      setIsCertification(true);
    } catch (error) {
      if (axios.isAxiosError<apiResponse, any>(error)) {
        console.log('API Error:', error?.response?.data.message);
      }
    }
  };

  const onChangeConfirm = async (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    // 휴대폰 인증 완료 자동
    const value = e.nativeEvent.text;
    if (value.length === 6) {
      setIsSend(true);
      await onPressConfirm();
    }
  };

  const onChangeFirstCheck = (isCheck: boolean) => {
    // 서비스 이용약관 동의
    setIsFirstChecked(isCheck);
  };

  const onChangeSecondCheck = (isCheck: boolean) => {
    // 개인정보 수집, 이용 동의
    setIsSecondChecked(isCheck);
  };

  const handleSignUp = async () => {
    // 회원가입 진행
    if (!isCertification) {
      Alert.alert('휴대폰 인증을 해주세요.');
      return;
    }
    if (!checkPassword(password) || !checkPassword(rePassword)) {
      Alert.alert('비밀번호 형식이 올바르지 않습니다.');
      return;
    }
    if (!isFirstChecked) {
      Alert.alert('서비스 이용약관에 동의해주세요.');
      return;
    }
    if (!isSecondChecked) {
      Alert.alert('개인정보 수집, 이용에 동의해주세요.');
      return;
    }

    const data = {
      phone: phone,
      name: name,
      birth: birthday, //moment(birthday).format('YYMMDD'),
      password: password,
      gender: gender,
    };

    try {
      await postSignUp(data);
      Alert.alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword;
    setSamePassword(isSame);
  }, [password, rePassword]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>회원가입</Text>
      <View style={{width: '80%'}}>
        <TextInput
          placeholder="성명"
          value={name}
          onChangeText={setName}
          readOnly={isCertification}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 2,
          }}>
          <TouchableOpacity
            style={{flexGrow: 1}}
            onPress={() => setIsPicker(true)}
            disabled={isCertification}>
            <Text disabled={isCertification}>
              {birthday ? birthday : '생년월일'}
            </Text>
          </TouchableOpacity>
          <View style={styles.dropdown}>
            <Dropdown
              list={genderList}
              disabled={isCertification}
              onChangeValue={onChangeGenderValue}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <TextInput
            placeholder="휴대폰 번호"
            value={phone}
            onChangeText={setPhone}
            onChange={e => onChangePhone(e)}
            maxLength={11}
            readOnly={isCertification}
          />
          <View style={styles.dropdown}>
            <Dropdown
              list={telecomList}
              onChangeValue={onChangeTelecomValue}
              disabled={isCertification}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="인증번호"
            value={smsCode}
            onChangeText={setSmsCode}
            onChange={e => onChangeConfirm(e)}
            maxLength={6}
            readOnly={isCertification}
          />
          {isSend && isPhone ? (
            <TouchableOpacity
              onPress={onPressConfirm}
              disabled={isCertification}>
              <Text>인증번호 확인</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                marginTop: 10,
              }}
              onPress={onPressCertification}
              disabled={isCertification}>
              <Text>인증번호 발송</Text>
            </TouchableOpacity>
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
        {!samePassword && (
          <Text style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</Text>
        )}
      </View>
      <Checkbox
        isChecked={isFirstChecked}
        disabled={false}
        onValueChangeHandler={onChangeFirstCheck}
        labelMessage="서비스 이용약관 동의 [보기]"
      />
      <Checkbox
        isChecked={isSecondChecked}
        disabled={false}
        onValueChangeHandler={onChangeSecondCheck}
        labelMessage="개인정보 수집, 이용 동의 [보기]"
      />
      <TouchableOpacity onPress={handleSignUp}>
        <Text>회원가입</Text>
      </TouchableOpacity>
      {isPicker && (
        <DateTimePicker
          value={new Date()}
          locale="ko-KR"
          onChange={(e, date) => setDate(date)}
          display="spinner"
          maximumDate={new Date()}
          timeZoneName={'Asia/Seoul'}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  dropdown: {
    width: 100,
  },
});
export default SignUp;

import React, {useEffect, useState} from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  checkDate,
  checkName,
  checkPassword,
  checkPhone,
} from '../../utils/regExpHelper.ts';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  postSignUp,
  postSignUpPhone,
  postSignUpSMS,
  postSignUpSMSConfirm,
  postSignUpTAS,
} from '../../hooks/useSignUp.ts';
import {TextInputChangeEventData} from 'react-native/Libraries/Components/TextInput/TextInput';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import CInput from '../../components/common/CustomInput/CInput.tsx';
import Checkbox from '../../components/common/Checkbox/Checkbox.tsx';
import Dropdown from '../../components/common/Dropdown/Dropdown.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import CText from '../../components/common/CustomText/CText.tsx';
import moment from 'moment';
import {ApiResponseProps} from '../../types/common.ts';
import CInputWithDropdown from '../../components/User/CInputWithDropdown.tsx';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [telecom, setTelecom] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isSend, setIsSend] = useState(false);
  const [isCertification, setIsCertification] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [isAllCheck, setIsAllCheck] = useState(true);
  const [isFirstChecked, setIsFirstChecked] = useState(true);
  const [isSecondChecked, setIsSecondChecked] = useState(true);

  const genderList = [
    // 성별 선택 드롭다운
    {label: '남', id: 'M'},
    {label: '여', id: 'F'},
  ];
  const onChangeGenderValue = (value: {label: string; id: string}) => {
    // 성별 선택
    setGender(value.id);
  };

  const telecomList = [
    // 통신사 선택 드롭다운
    {label: 'SKT', id: 'SKT'},
    {label: 'KT', id: 'KT'},
    {label: 'LG U+', id: 'LGT'},
  ];

  const onChangeTelecomValue = (value: {label: string; id: string}) => {
    // 통신사 선택
    setTelecom(value.id);
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
      return false;
    }
  };

  const tasCertification = async () => {
    // TAS 인증
    const data = {
      phone: phone,
      name: name,
      gender: gender,
      birth: birthday.substring(2),
      telecom: telecom,
    };

    try {
      const response = await postSignUpTAS(data);
      if (response?.code === '0000') {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const smsCertification = async () => {
    setSmsCode('');

    // SMS 인증 요청
    const data = {phone: phone};
    try {
      const response = await postSignUpSMS(data);
      if (response) {
        setIsSend(true);
      }
    } catch (e) {
      console.log(e);
      Alert.alert('SMS 인증 요청에 실패했습니다.');
    }
  };

  const handleConfirm = async (code: string) => {
    // SMS 인증 완료 요청
    const data = {
      phone: phone,
      verifyCode: code,
    };

    try {
      await postSignUpSMSConfirm(data);
      setIsCertification(true);
    } catch (error) {
      console.log(error);
      Alert.alert('인증에 실패했습니다. \n정보를 확인해주세요.');
    }
  };

  const onPressCertification = async () => {
    // 전체 인증 요청
    if (
      !checkName(name) ||
      !checkDate(birthday) ||
      !gender ||
      !checkPhone(phone) ||
      !telecom
    ) {
      Alert.alert('입력을 확인해주세요.');
      return;
    }

    const isDoubleCheckPhone = await doubleCheckPhone();
    if (!isDoubleCheckPhone) {
      Alert.alert('이미 사용중인 휴대폰 번호입니다.');
      setIsSend(false);
      return;
    }

    const resultTasCertification = await tasCertification();
    if (!resultTasCertification) {
      Alert.alert('인증에 실패했습니다.\n정보를 확인해주세요.');
      setIsSend(false);
      return;
    }

    await smsCertification();
  };

  const onPressSignUp = async () => {
    // 가입하기 버튼 클릭
    if (!isCertification) {
      Alert.alert('휴대폰 인증을 먼저 진행해주세요.');
      return;
    }

    if (!checkPassword(password) || !samePassword) {
      Alert.alert('비밀번호를 확인해주세요.');
      return;
    }

    if (!isFirstChecked || !isSecondChecked) {
      Alert.alert('약관에 모두 동의해주세요.');
      return;
    }

    // 회원가입 진행
    const data = {
      phone: phone,
      name: name,
      birth: birthday.substring(2),
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

  const handleChangeSmsCode = async (value: string) => {
    setSmsCode(value);
    if (value.length === 6) {
      await handleConfirm(value);
    }
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword && checkPassword(rePassword);
    setSamePassword(isSame);
  }, [password, rePassword]);

  return (
    <CSafeAreaView>
      <Header title="회원가입" navigation={navigation} isBack />
      <CView>
        <ScrollView>
          <CInput
            title="성명"
            inputValue={name}
            setInputValue={setName}
            errorMessage="이름을 입력해 주세요."
            isWarning={!checkName(name)}
            maxLength={4}
            inputMode="text"
            readOnly={isSend}
          />
          <View style={[styles.inputRow, {zIndex: 3}]}>
            <CInputWithDropdown
              title="생년월일"
              inputValue={birthday}
              setInputValue={setBirthday}
              placeholder="YYYYMMDD"
              errorMessage="생년월일을 입력해 주세요."
              dropDownItems={genderList}
              dropDownOnSelect={onChangeGenderValue}
              dropDownDisabled={isSend}
              dropDownPlaceHolder="성별"
              isWarning={!checkDate(birthday)}
              maxLength={8}
              inputMode="numeric"
              readOnly={isSend}
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={[styles.inputRow, {zIndex: 2}]}>
            <CInputWithDropdown
              title="휴대폰 번호"
              inputValue={phone}
              setInputValue={setPhone}
              placeholder="01012341234"
              errorMessage="휴대폰 번호를 바르게 입력해 주세요."
              isWarning={!checkPhone(phone)}
              maxLength={11}
              inputMode="tel"
              readOnly={isSend}
              dropDownItems={telecomList}
              dropDownOnSelect={onChangeTelecomValue}
              dropDownDisabled={isSend}
              dropDownPlaceHolder="통신사"
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={styles.inputRow}>
            <CInput
              title="인증번호"
              inputValue={smsCode}
              setInputValue={handleChangeSmsCode}
              errorMessage="올바른 인증번호를 입력해 주세요."
              isWarning={
                isSend ? smsCode.length > 0 && smsCode.length < 6 : false
              }
              maxLength={6}
              inputMode="numeric"
              fullWidth="58%"
              readOnly={!isSend || isCertification}
            />
            <View style={{width: '40%'}}>
              {isSend ? (
                <CButton
                  text={isCertification ? '인증 완료' : '재발송'}
                  onPress={onPressCertification}
                  disabled={isCertification}
                />
              ) : (
                <CButton text="인증 문자 발송" onPress={onPressCertification} />
              )}
            </View>
          </View>
          <CInput
            title="비밀번호 입력"
            inputValue={password}
            setInputValue={setPassword}
            errorMessage="영문+숫자 조합 8자리 이상 입력해 주세요."
            isWarning={!checkPassword(password)}
            secureTextEntry
          />
          <CInput
            title="비밀번호 입력 확인"
            inputValue={rePassword}
            setInputValue={setRePassword}
            errorMessage="동일한 비밀번호를 입력해 주세요."
            isWarning={!samePassword}
            secureTextEntry
          />
          <Checkbox
            isChecked={isFirstChecked && isSecondChecked}
            onValueChangeHandler={setIsAllCheck}
            labelMessage="전체동의"
            fontSize={14}
            bold
          />
          <Checkbox
            isChecked={isFirstChecked}
            onValueChangeHandler={setIsFirstChecked}
            labelMessage="서비스 이용약관 동의">
            <CText text="[보기]" fontWeight="600" fontSize={12} />
          </Checkbox>
          <Checkbox
            isChecked={isSecondChecked}
            onValueChangeHandler={setIsSecondChecked}
            labelMessage="개인정보 수집 이용 동의">
            <CText text="[보기]" fontWeight="600" fontSize={12} />
          </Checkbox>
          <CButton text="가입하기" onPress={onPressSignUp} />
        </ScrollView>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default SignUp;
